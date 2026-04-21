import json
import os
import uuid
import boto3
import math
import time
from decimal import Decimal
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import requests
from youtube_transcript_api import YouTubeTranscriptApi

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if int(obj) == obj else float(obj)
        return super(DecimalEncoder, self).default(obj)

# Clients
s3_client = boto3.client('s3')
textract_client = boto3.client('textract', region_name='us-east-1')
bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb')

TABLE_NAME = os.environ.get('DYNAMODB_TABLE_NAME', 'GeneratedPaths')
BUCKET_NAME = os.environ.get('STORAGE_RENAISSANCE_BUCKETNAME')

table = dynamodb.Table(TABLE_NAME)

# ---------------------------------------------------------------------------
# Groq API Keys (round-robin across 4 keys)
# ---------------------------------------------------------------------------
GROQ_KEYS = [
    os.environ.get('GROQ_API_KEY_1'),
    os.environ.get('GROQ_API_KEY_2'),
    os.environ.get('GROQ_API_KEY_3'),
    os.environ.get('GROQ_API_KEY_4')
]
GROQ_KEYS = [k for k in GROQ_KEYS if k]

# ---------------------------------------------------------------------------
# Source Extraction (unchanged)
# ---------------------------------------------------------------------------

def extract_pdf_text(s3_key):
    if not s3_key or not BUCKET_NAME:
        return ""
    try:
        response = textract_client.detect_document_text(
            Document={
                'S3Object': {
                    'Bucket': BUCKET_NAME,
                    'Name': s3_key
                }
            }
        )
        text = ''
        for block in response['Blocks']:
            if block['BlockType'] == 'LINE':
                text += block['Text'] + '\n'
        return text
    except Exception as e:
        return f"Error: {str(e)}"

def extract_youtube_transcript(url):
    try:
        parsed_url = urlparse(url)
        video_id = None
        if parsed_url.hostname in ('youtu.be', 'www.youtu.be'):
            video_id = parsed_url.path[1:]
        elif parsed_url.hostname in ('youtube.com', 'www.youtube.com'):
            if parsed_url.path == '/watch':
                query = parsed_url.query
                params = dict(x.split('=') for x in query.split('&') if '=' in x)
                video_id = params.get('v')
        
        if not video_id:
            return ""

        if hasattr(YouTubeTranscriptApi, 'get_transcript'):
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript = ' '.join([item['text'] if isinstance(item, dict) else getattr(item, 'text', '') for item in transcript_list])
        else:
            transcript_list = YouTubeTranscriptApi().fetch(video_id)
            transcript = ' '.join([item.text for item in transcript_list])
        return transcript
    except Exception as e:
        return f"Error: {str(e)}"

def extract_website_text(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception as e:
        return f"Error: {str(e)}"

# ---------------------------------------------------------------------------
# Groq API Caller (with key rotation and retry)
# ---------------------------------------------------------------------------

def call_groq(prompt, system_msg, key_index=0, max_retries=2):
    """Call Groq API with a specific key index (round-robin). Returns parsed JSON."""
    if not GROQ_KEYS:
        raise Exception("No Groq API keys configured")
    
    api_key = GROQ_KEYS[key_index % len(GROQ_KEYS)]
    
    for attempt in range(max_retries + 1):
        try:
            print(f"[Groq] key ...{api_key[-4:]}, attempt {attempt+1}")
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.3,
                "max_tokens": 8000
            }
            response = requests.post(url, headers=headers, json=data, timeout=90)
            
            if response.status_code == 429:
                # Rate limited — try next key
                print(f"[Groq] Rate limited on key ...{api_key[-4:]}, rotating")
                key_index += 1
                api_key = GROQ_KEYS[key_index % len(GROQ_KEYS)]
                time.sleep(2)
                continue
            
            if response.status_code != 200:
                print(f"[Groq] Error {response.status_code}: {response.text[:200]}")
                if attempt < max_retries:
                    time.sleep(1)
                    continue
                raise Exception(f"Groq API error: {response.status_code}")
            
            resp_json = response.json()
            text_response = resp_json['choices'][0]['message']['content']
            
            # Strip markdown wrappers if present
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0]
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0]
            
            return json.loads(text_response.strip())
        
        except json.JSONDecodeError as e:
            print(f"[Groq] JSON parse error: {str(e)[:100]}")
            if attempt < max_retries:
                time.sleep(1)
                continue
            raise Exception(f"Failed to parse Groq response as JSON: {str(e)}")
        except requests.exceptions.Timeout:
            print(f"[Groq] Timeout on attempt {attempt+1}")
            if attempt < max_retries:
                continue
            raise Exception("Groq API request timed out")
    
    raise Exception("All Groq retry attempts exhausted")

# ---------------------------------------------------------------------------
# PHASE 1: Chunked Concept Extraction
# ---------------------------------------------------------------------------

def phase1_extract_concepts(raw_text):
    """Split raw text into chunks and extract key concepts from each."""
    CHUNK_SIZE = 12000  # ~3000 tokens per chunk
    chunks = []
    for i in range(0, len(raw_text), CHUNK_SIZE):
        chunk = raw_text[i:i + CHUNK_SIZE]
        if chunk.strip():
            chunks.append(chunk)
    
    print(f"[Phase 1] Splitting {len(raw_text)} chars into {len(chunks)} chunks")
    
    all_concepts = {
        "key_frameworks": [],
        "specific_examples": [],
        "expert_quotes": [],
        "mental_models": [],
        "techniques_and_methods": [],
        "core_arguments": [],
        "case_studies": [],
        "terminology": []
    }
    
    system_msg = """You are a knowledge extraction specialist. Your job is to deeply analyze raw source material and extract structured knowledge.

You must return JSON with these fields:
- "key_frameworks": Array of named frameworks, systems, or models discussed (e.g. "The Rule of Three", "The 10,000 Hour Reality")
- "specific_examples": Array of concrete examples, anecdotes, or illustrations used
- "expert_quotes": Array of {"text": "...", "author": "..."} objects for any notable quotes or strong statements
- "mental_models": Array of key mental models or thinking tools presented
- "techniques_and_methods": Array of specific actionable techniques described
- "core_arguments": Array of the central theses or arguments made
- "case_studies": Array of detailed case studies or before/after comparisons
- "terminology": Array of {"term": "...", "definition": "..."} for domain-specific vocabulary

Extract EVERYTHING of value. Be thorough. Preserve specificity — keep exact names, numbers, and details."""

    for i, chunk in enumerate(chunks):
        key_idx = i % len(GROQ_KEYS)
        prompt = f"""Extract all key concepts, frameworks, quotes, examples, and techniques from this source material chunk ({i+1}/{len(chunks)}):

---
{chunk}
---

Return the structured JSON extraction."""
        
        try:
            result = call_groq(prompt, system_msg, key_index=key_idx)
            # Merge results
            for field in all_concepts:
                items = result.get(field, [])
                if isinstance(items, list):
                    all_concepts[field].extend(items)
        except Exception as e:
            print(f"[Phase 1] Chunk {i+1} extraction failed: {str(e)}")
            continue
        
        # Small delay between chunks to respect rate limits
        if i < len(chunks) - 1:
            time.sleep(1)
    
    print(f"[Phase 1] Extracted: {sum(len(v) for v in all_concepts.values())} total items")
    return all_concepts

# ---------------------------------------------------------------------------
# PHASE 2: Syllabus Architecture
# ---------------------------------------------------------------------------

def phase2_architect_syllabus(title, concepts):
    """Design the high-level curriculum skeleton from extracted concepts."""
    print(f"[Phase 2] Architecting syllabus for: {title}")
    
    system_msg = """You are a world-class curriculum architect. You design learning paths that feel like premium masterclasses — not generic courses.

Rules:
- Each phase MUST have a compelling, specific title (e.g. "The Anatomy of a Laugh" not "Introduction to Comedy")
- Each lesson title must be a named concept or framework (e.g. "The Jeselnik Edit" not "Lesson 3")
- Design 3-6 phases with 3-5 lessons each
- Ensure logical progression: foundations → intermediate application → advanced mastery
- Each lesson needs a "type" from: concept, framework, technique, psychology, execution, system, methodology, exploration, ethics, philosophy
- Assign realistic durations (15-45 min per lesson)
- Each phase needs a slug (lowercase-hyphenated)
- Each lesson needs a unique id and slug

Return JSON matching this schema:
{
  "phases": [
    {
      "id": 1,
      "slug": "phase-slug",
      "title": "Compelling Phase Title",
      "description": "One-sentence description of what this phase covers.",
      "duration": "4.5 hours",
      "lessons": [
        {
          "id": "unique-id",
          "slug": "lesson-slug",
          "title": "Named Concept Title",
          "type": "framework",
          "duration": "30 min"
        }
      ]
    }
  ]
}"""

    concepts_summary = json.dumps(concepts, indent=1, default=str)[:8000]
    
    prompt = f"""Design a premium masterclass curriculum titled "{title}".

Here are all the key concepts, frameworks, quotes, and techniques extracted from the source material:

{concepts_summary}

Create a structured syllabus that transforms this raw knowledge into a compelling learning journey. 
Every phase and lesson title should feel like it belongs in a $500 masterclass — specific, bold, and intriguing.
Do NOT use generic titles like "Introduction" or "Getting Started". Use the actual named frameworks and concepts from the material."""

    return call_groq(prompt, system_msg, key_index=1)

# ---------------------------------------------------------------------------
# PHASE 3: Deep Content Writing (per phase)
# ---------------------------------------------------------------------------

def phase3_write_content(title, syllabus, concepts):
    """Write rich content for each lesson individually to avoid token truncation."""
    print(f"[Phase 3] Writing deep content for {len(syllabus.get('phases', []))} phases")
    
    system_msg = """You are a masterclass content writer. You write with the authority and depth of a world-class instructor.

Your writing style:
- BOLD and DEFINITIVE statements. Never hedge. ("Stand-up is math." not "Stand-up can be thought of as somewhat mathematical.")
- Use SPECIFIC examples with concrete details. Names, numbers, dates, places.
- Write as if the reader is a serious student paying $500 for this knowledge.

You must generate content as a JSON array of content blocks. Each block has a "type" field.
Available content block types:

1. {"type": "intro", "text": "..."} — Opening paragraph for the lesson. MUST be bold, opinionated, and hook the reader instantly. 1-3 sentences max.

2. {"type": "heading", "text": "..."} — Section headers WITHIN the lesson. Use named frameworks ("The Four Layers of Funny") not generic labels ("Overview").

3. {"type": "list", "items": ["**Bold Label:** Explanation...", ...]} — Lists where EVERY item starts with a **Bold Label:** followed by a detailed explanation. This is critical — never use plain unlabeled bullets.

4. {"type": "callout", "variant": "important|warning|info", "text": "..."} — Sidebars for critical insights, warnings, or extra context.

5. {"type": "quote", "text": "...", "author": "..."} — Expert quotes. Only use real or clearly attributed quotes.

6. {"type": "paragraph", "text": "..."} — Explanatory prose. Use **bold** for key terms inline. Include case studies, before/after comparisons, and analysis.

RULES:
- This lesson MUST have: 1 intro, 2-4 headings, 2-3 lists, 1-2 callouts, and at least 1 quote or 1 paragraph with a case study.
- Lists MUST have **Bold Label:** format for every single item.
- Include keyTakeaways (2-3 items) — sharp, memorable statements.
- Content should be DEEP. Produce 6-12 content blocks.

Return JSON:
{
  "content": [ 
    {"type": "intro", "text": "..."}
  ],
  "keyTakeaways": ["...", "..."]
}"""

    phases = syllabus.get('phases', [])
    completed_phases = []
    concepts_summary = json.dumps(concepts, indent=1, default=str)[:6000]
    
    for i, phase in enumerate(phases):
        print(f"[Phase 3] Generating phase {i+1}/{len(phases)}: {phase.get('title', '')}")
        completed_lessons = []
        
        for j, lesson in enumerate(phase.get('lessons', [])):
            key_idx = (i + j + 2) % len(GROQ_KEYS)  # Rotate keys uniquely per lesson
            
            prompt = f"""Write the FULL, DEEP content for this specific lesson in the masterclass "{title}".

Phase Context: {phase.get('title', '')} - {phase.get('description', '')}

Lesson to Write:
Title: {lesson.get('title', '')}
Type: {lesson.get('type', '')}

Source material concepts to draw from:
{concepts_summary}

Write this lesson with MAXIMUM depth and richness. Generate 6-12 content blocks.
Every list item must use **Bold Label:** format.
The intro must be bold and provocative, not generic.

Return the JSON object with "content" array and "keyTakeaways" array."""

            try:
                result = call_groq(prompt, system_msg, key_index=key_idx)
                
                # Merge generated content into lesson
                lesson['content'] = result.get('content', [
                    {"type": "intro", "text": f"Welcome to {lesson.get('title', 'this lesson')}."},
                    {"type": "paragraph", "text": "Key concepts are discussed here."}
                ])
                lesson['keyTakeaways'] = result.get('keyTakeaways', ["Review the core concepts."])
                
                print(f"   -> Completed lesson: {lesson.get('title', '')}")
            except Exception as e:
                print(f"   -> Failed lesson {lesson.get('title', '')}: {str(e)}")
                lesson['content'] = [
                    {"type": "intro", "text": f"This lesson covers {lesson.get('title', 'key concepts')}."},
                    {"type": "heading", "text": "Core Concepts"},
                    {"type": "paragraph", "text": "Content generation encountered an error. Please regenerate this path."}
                ]
                lesson['keyTakeaways'] = ["Content generation incomplete — please regenerate."]
            
            completed_lessons.append(lesson)
            time.sleep(1) # Small delay between lessons
            
        phase['lessons'] = completed_lessons
        completed_phases.append(phase)
        time.sleep(1) # Small delay between phases
        
    return completed_phases

# ---------------------------------------------------------------------------
# PHASE 4: Exercises & Projects
# ---------------------------------------------------------------------------

def phase4_generate_exercises(title, phases):
    """Generate high-friction exercises and phase projects."""
    print(f"[Phase 4] Generating exercises and projects")
    
    system_msg = """You are a master educator who designs challenging, actionable exercises — NOT quizzes or multiple choice.

Your exercises should be:
- Creative challenges that force the student to APPLY knowledge
- Specific and constrained (not vague "practice more")  
- Named with compelling titles (e.g. "The Jeselnik Reduction" not "Exercise 3")

Your projects should be:
- Multi-step practical tasks that synthesize the entire phase
- Detailed enough that the student knows exactly what to produce

Return JSON:
{
  "phase_additions": [
    {
      "phase_id": 1,
      "exercises": [
        {
          "id": "ex-unique",
          "title": "Creative Exercise Name",
          "type": "challenge",
          "description": "Detailed, specific instructions for the exercise..."
        }
      ],
      "project": {
        "title": "Compelling Project Name",
        "description": "Detailed multi-step project description..."
      }
    }
  ]
}"""

    # Build a summary of all phases and their lesson titles
    phase_summaries = []
    for p in phases:
        lessons = [l.get('title', '') for l in p.get('lessons', [])]
        phase_summaries.append({
            "id": p.get('id'),
            "title": p.get('title', ''),
            "lessons": lessons
        })
    
    prompt = f"""Design exercises and a capstone project for EACH phase of the masterclass "{title}".

Phases and their lessons:
{json.dumps(phase_summaries, indent=1)}

For each phase, create:
1. 1-2 exercises that are creative, hands-on challenges (NOT quizzes). Each exercise should force the student to produce something.
2. 1 capstone project that synthesizes all lessons in that phase into a single deliverable.

Make exercise titles catchy and specific. Make descriptions detailed enough that a student knows exactly what to do.
Example quality: "The Assumption Game: Write down 3 mundane setups. For each, list 5 logical assumptions. Then write a punchline that shatters the strongest assumption."
NOT: "Practice Exercise: Try writing some jokes." """

    return call_groq(prompt, system_msg, key_index=0)

# ---------------------------------------------------------------------------
# Main Orchestrator
# ---------------------------------------------------------------------------

def generate_curriculum(title, raw_text):
    """4-phase pipeline: Extract → Architect → Write → Apply"""
    print(f"\n{'='*60}")
    print(f"GENERATING CURRICULUM: {title}")
    print(f"Source material: {len(raw_text)} characters")
    print(f"{'='*60}\n")
    
    # PHASE 1: Extract concepts from ALL source material
    concepts = phase1_extract_concepts(raw_text)
    
    # PHASE 2: Design the syllabus skeleton
    syllabus = phase2_architect_syllabus(title, concepts)
    
    # PHASE 3: Write deep content for each phase
    completed_phases = phase3_write_content(title, syllabus, concepts)
    
    # PHASE 4: Generate exercises and projects
    try:
        exercises_data = phase4_generate_exercises(title, completed_phases)
        
        # Merge exercises into phases
        phase_additions = exercises_data.get('phase_additions', [])
        for addition in phase_additions:
            phase_id = addition.get('phase_id')
            for phase in completed_phases:
                if phase.get('id') == phase_id:
                    phase['exercises'] = addition.get('exercises', [])
                    phase['project'] = addition.get('project', {})
                    break
    except Exception as e:
        print(f"[Phase 4] Exercise generation failed: {str(e)}")
        # Ensure every phase has at least empty exercises
        for phase in completed_phases:
            if 'exercises' not in phase:
                phase['exercises'] = []
            if 'project' not in phase:
                phase['project'] = {"title": "Phase Project", "description": "Apply the concepts from this phase in a practical project."}
    
    # Ensure all phases have resources array
    for phase in completed_phases:
        if 'resources' not in phase:
            phase['resources'] = []
    
    # Build final curriculum
    curriculum = {
        "title": title,
        "description": syllabus.get('description', f"A comprehensive learning path on {title}."),
        "phases": completed_phases
    }
    
    # Generate description from phase titles if not present
    if not curriculum['description'] or curriculum['description'] == f"A comprehensive learning path on {title}.":
        phase_titles = [p.get('title', '') for p in completed_phases[:3]]
        if phase_titles:
            curriculum['description'] = f"Master {title.lower()} through {len(completed_phases)} phases covering {', '.join(phase_titles[:2])}, and more."
    
    print(f"\n{'='*60}")
    print(f"GENERATION COMPLETE: {len(completed_phases)} phases")
    print(f"{'='*60}\n")
    
    return curriculum

# ---------------------------------------------------------------------------
# Bedrock Implementation (preserved for future use when quota is increased)
# ---------------------------------------------------------------------------

def generate_curriculum_bedrock(title, prompt):
    model_configs = [
        {"id": "us.amazon.nova-lite-v1:0", "provider": "amazon"},
        {"id": "amazon.nova-lite-v1:0", "provider": "amazon"},
        {"id": "us.meta.llama3-2-3b-instruct-v1:0", "provider": "meta"},
        {"id": "meta.llama3-8b-instruct-v1:0", "provider": "meta"},
        {"id": "us.anthropic.claude-3-haiku-20240307-v1:0", "provider": "anthropic"}
    ]

    last_error = None
    for mc in model_configs:
        model_id = mc["id"]
        try:
            print(f"Trying Bedrock model: {model_id}")
            if hasattr(bedrock_client, 'converse'):
                response = bedrock_client.converse(
                    modelId=model_id,
                    messages=[{"role": "user", "content": [{"text": prompt}]}],
                    inferenceConfig={"maxTokens": 4096, "temperature": 0.2}
                )
                text_response = response['output']['message']['content'][0]['text']
            else:
                if mc["provider"] == "anthropic":
                    body = {"anthropic_version": "bedrock-2023-05-31", "max_tokens": 4096, "messages": [{"role": "user", "content": prompt}]}
                elif mc["provider"] == "meta":
                    body = {"prompt": f"<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n", "max_gen_len": 2048, "temperature": 0.2}
                elif mc["provider"] == "amazon":
                    body = {"schemaVersion": "messages-v1", "messages": [{"role": "user", "content": [{"text": prompt}]}], "inferenceConfig": {"maxTokens": 4096, "temperature": 0.2}}
                else:
                    continue
                response = bedrock_client.invoke_model(modelId=model_id, body=json.dumps(body))
                response_body = json.loads(response['body'].read())
                if mc["provider"] == "anthropic":
                    text_response = response_body['content'][0]['text']
                elif mc["provider"] == "meta":
                    text_response = response_body['generation']
                elif mc["provider"] == "amazon":
                    text_response = response_body['output']['message']['content'][0]['text']

            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0]
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0]
            curriculum = json.loads(text_response.strip())
            print(f"Successfully used Bedrock model: {model_id}")
            return curriculum
        except Exception as e:
            print(f"Bedrock model {model_id} failed: {str(e)}")
            last_error = e
            if 'AccessDenied' in str(e) or 'ResourceNotFound' in str(e) or 'ValidationException' in str(e) or 'use case details' in str(e) or 'end of its life' in str(e):
                continue
            if isinstance(e, json.JSONDecodeError):
                continue
            raise e
    raise last_error

# ---------------------------------------------------------------------------
# Lambda Handler
# ---------------------------------------------------------------------------

def handler(event, context):
    path = event.get('path', '')
    http_method = event.get('httpMethod', '')

    headers = {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }

    if http_method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    # GET /allpaths (List all paths)
    if http_method == 'GET' and (path == '/allpaths' or path == '/allpaths/'):
        try:
            response = table.scan(
                ProjectionExpression="id, pathId, title, description, phases"
            )
            items = response.get('Items', [])
            paths_list = []
            for item in items:
                paths_list.append({
                    "id": item.get('pathId', item.get('id')),
                    "title": item.get('title', 'Generated Path'),
                    "description": item.get('description', ''),
                    "phaseCount": len(item.get('phases', [])),
                    "isGenerated": True,
                    "status": "active"
                })
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(paths_list, cls=DecimalEncoder)}
        except Exception as e:
            return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

    # GET /paths/{pathId}
    if http_method == 'GET' and path.startswith('/paths/') and len(path.split('/')) > 2:
        path_id = event.get('pathParameters', {}).get('pathId') or path.split('/')[-1]
        try:
            response = table.get_item(Key={'pathId': path_id})
            item = response.get('Item')
            if not item:
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Path not found'})}
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(item, cls=DecimalEncoder)}
        except Exception as e:
            return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

    # POST /generate
    if http_method == 'POST' and path.endswith('/generate'):
        body = json.loads(event.get('body', '{}'))
        title = body.get('title', 'Generated Path')
        pdf_key = body.get('pdfKey')
        youtube_urls = body.get('youtubeUrls', [])
        website_urls = body.get('websiteUrls', [])

        combined_text = ""
        errors = []

        if pdf_key:
            result = extract_pdf_text(pdf_key)
            if result and not result.startswith('Error:'):
                combined_text += result + "\n"
            else:
                errors.append(f"PDF extraction failed for key '{pdf_key}': {result}")

        for url in youtube_urls:
            if not url or not url.strip():
                continue
            result = extract_youtube_transcript(url)
            if result and not result.startswith('Error:'):
                combined_text += result + "\n"
            else:
                errors.append(f"YouTube extraction failed for '{url}': {result}")

        for url in website_urls:
            if not url or not url.strip():
                continue
            result = extract_website_text(url)
            if result and not result.startswith('Error:'):
                combined_text += result + "\n"
            else:
                errors.append(f"Website extraction failed for '{url}': {result}")

        if not combined_text.strip():
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({
                'error': 'No content extracted from sources.',
                'details': errors,
                'debug': {
                    'youtube_urls_received': youtube_urls,
                    'website_urls_received': website_urls,
                    'pdf_key_received': pdf_key
                }
            })}

        try:
            curriculum = generate_curriculum(title, combined_text)
            path_id = body.get('pathId') or str(uuid.uuid4())
            curriculum['id'] = path_id
            curriculum['pathId'] = path_id

            table.put_item(Item=curriculum)

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(curriculum)}
        except Exception as e:
            print("Generation Error:", str(e))
            return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': f'Failed to generate curriculum: {str(e)}'})}

    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not Found'})}