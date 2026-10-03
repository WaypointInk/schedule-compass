// Builds www/ for the iPhone/iPad app from the web files in the repo root.
// The web version loads fonts and the photo reader from the internet; the app gets
// its own copies so it works with no connection and makes no outside requests.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), www = p => path.join(root, 'www', p), nm = p => path.join(root, 'node_modules', p);
function copyFile(src, dst){ fs.mkdirSync(path.dirname(dst), {recursive:true}); fs.copyFileSync(src, dst); }
if(!fs.existsSync(nm('@capacitor/core'))) throw new Error('Run `npm install` first.');

fs.rmSync(www(''), {recursive:true, force:true});
for(const f of fs.readdirSync(root)) if(/^(index|privacy|support)\.html$|\.webmanifest$|^icon-.*\.png$/.test(f)) copyFile(path.join(root, f), www(f));

// Fonts: the same families and weights the Google Fonts link asks for (Latin + Latin Extended)
const FONTS = [
  ['cormorant-garamond', ['500', '600', '500-italic', '600-italic']],
  ['jost', ['400', '500', '600']],
  ['parisienne', ['400']],
  ['fraunces', ['500', '600']],
  ['figtree', ['400', '500', '600']],
  ['barlow-condensed', ['600', '700']],
  ['barlow', ['400', '500', '600']]
];
let css = '/* Bundled copies of the Google Fonts the app uses (from Fontsource). */\n';
for(const [name, styles] of FONTS){
  for(const st of styles){
    const src = fs.readFileSync(nm(`@fontsource/${name}/${st}.css`), 'utf8');
    for(const block of src.match(/@font-face\s*{[^}]*}/g)){
      const woff2 = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/)[1];
      if(!woff2.startsWith(`${name}-latin-`)) continue;
      copyFile(nm(`@fontsource/${name}/files/${woff2}`), www(`fonts/${woff2}`));
      css += block.replace(/src:[^;]*;/, `src: url(${woff2}) format('woff2');`) + '\n';
    }
  }
}
fs.writeFileSync(www('fonts/fonts.css'), css);

let html = fs.readFileSync(www('index.html'), 'utf8');
const before = html;
html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\n?/g, '');
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]*" rel="stylesheet">/, '<link href="fonts/fonts.css" rel="stylesheet">');
if(html === before || /fonts\.googleapis\.com/.test(html)) throw new Error('Could not swap the Google Fonts link in index.html for the bundled fonts');
fs.writeFileSync(www('index.html'), html);

// Photo reader (Tesseract): script, worker, WebAssembly core, English language data.
// index.html points at these paths when it runs inside the app.
copyFile(nm('tesseract.js/dist/tesseract.min.js'), www('vendor/tesseract/tesseract.min.js'));
copyFile(nm('tesseract.js/dist/worker.min.js'), www('vendor/tesseract/worker.min.js'));
for(const f of fs.readdirSync(nm('tesseract.js-core'))){
  if(/^tesseract-core.*\.(js|wasm)$/.test(f)) copyFile(nm('tesseract.js-core/' + f), www('vendor/tesseract/core/' + f));
}
const langDir = ['4.0.0_best_int', '4.0.0'].map(d => nm('@tesseract.js-data/eng/' + d)).find(d => fs.existsSync(path.join(d, 'eng.traineddata.gz')));
if(!langDir) throw new Error('English language data not found in @tesseract.js-data/eng');
copyFile(path.join(langDir, 'eng.traineddata.gz'), www('vendor/tesseract/lang/eng.traineddata.gz'));

console.log('www/ built: app files, bundled fonts and photo reader. The app runs fully offline.');
