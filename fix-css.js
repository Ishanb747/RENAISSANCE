const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(/\* \{\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n\}\n/, '');
fs.writeFileSync('src/index.css', css);
