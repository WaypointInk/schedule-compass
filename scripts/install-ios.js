// Runs after `npx cap add ios`. Adds the print button, app icon, launch screen,
// camera/photo permission text, and the export-compliance answer.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const app = path.join(root, 'ios', 'App', 'App');
if(!fs.existsSync(app)){ console.error('Run `npx cap add ios` first.'); process.exit(1); }

// 1) Native files (added to the Xcode target by scripts/ios-add-files.rb)
for(const f of ['PrintPlugin.swift', 'MainViewController.swift', 'PrivacyInfo.xcprivacy']) fs.copyFileSync(path.join(root, 'ios-native', f), path.join(app, f));

// 2) Use MainViewController so the print plugin is registered
const sb = path.join(app, 'Base.lproj', 'Main.storyboard');
let x = fs.readFileSync(sb, 'utf8');
x = x.replace(/customClass="CAPBridgeViewController" customModule="Capacitor"/, 'customClass="MainViewController" customModule="App" customModuleProvider="target"');
if(!x.includes('customClass="MainViewController"')){ console.error('Could not point Main.storyboard at MainViewController'); process.exit(1); }
fs.writeFileSync(sb, x);

// 3) Info.plist: permission text (the calendar photo button can open the camera) + "no special encryption" answer
const plist = path.join(app, 'Info.plist');
let p = fs.readFileSync(plist, 'utf8');
const addStr = (k, v) => { if(!p.includes(`<key>${k}</key>`)) p = p.replace(/<dict>/, `<dict>\n\t<key>${k}</key>\n\t<string>${v}</string>`); };
addStr('NSCameraUsageDescription', 'Take a photo of your school calendar so Schedule Compass can find days off and deadlines. Photos stay on your device.');
addStr('NSPhotoLibraryUsageDescription', 'Choose a photo or screenshot of your school calendar so Schedule Compass can find days off and deadlines. Photos stay on your device.');
if(!p.includes('<key>ITSAppUsesNonExemptEncryption</key>')) p = p.replace(/<dict>/, '<dict>\n\t<key>ITSAppUsesNonExemptEncryption</key>\n\t<false/>');
fs.writeFileSync(plist, p);

// 4) App icon (single 1024 image; Xcode makes the other sizes)
const icons = path.join(app, 'Assets.xcassets', 'AppIcon.appiconset');
fs.mkdirSync(icons, {recursive:true});
for(const f of fs.readdirSync(icons)) if(f.endsWith('.png')) fs.unlinkSync(path.join(icons, f));
fs.copyFileSync(path.join(root, 'mobile-assets', 'icon-1024.png'), path.join(icons, 'AppIcon-1024.png'));
fs.writeFileSync(path.join(icons, 'Contents.json'), JSON.stringify({
  images: [{filename: 'AppIcon-1024.png', idiom: 'universal', platform: 'ios', size: '1024x1024'}],
  info: {author: 'xcode', version: 1}
}, null, 2));

// 5) Launch screen image (light and dark)
const splash = path.join(app, 'Assets.xcassets', 'Splash.imageset');
fs.mkdirSync(splash, {recursive:true});
for(const f of fs.readdirSync(splash)) if(f.endsWith('.png')) fs.unlinkSync(path.join(splash, f));
fs.copyFileSync(path.join(root, 'mobile-assets', 'ios-splash-2732.png'), path.join(splash, 'splash.png'));
fs.copyFileSync(path.join(root, 'mobile-assets', 'ios-splash-dark-2732.png'), path.join(splash, 'splash-dark.png'));
const imgs = [];
for(const scale of ['1x', '2x', '3x']){
  imgs.push({idiom: 'universal', filename: 'splash.png', scale});
  imgs.push({idiom: 'universal', filename: 'splash-dark.png', scale, appearances: [{appearance: 'luminosity', value: 'dark'}]});
}
fs.writeFileSync(path.join(splash, 'Contents.json'), JSON.stringify({images: imgs, info: {author: 'xcode', version: 1}}, null, 2));

console.log('iOS: print button, icon, launch screen and permissions set up.');
