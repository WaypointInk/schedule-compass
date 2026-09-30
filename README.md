# Schedule Compass

A weekly planner for college students, by Waypoint Ink. It asks for a student's courses, credits, work shifts and school calendar, then plans every day: study time by course, meals, sleep that moves for early shifts, a weekly walk, and a new affirmation every day of the year.

Everything runs on the device. There are no accounts, servers or analytics.

## What's in this folder

- `index.html`: the whole app
- `manifest.webmanifest`: app name, colors and icons, so it installs like an app
- `sw.js`: offline support
- `icon-*.png`: app icons in the sizes the Microsoft Store needs
- `privacy.html`: privacy policy (link this in Partner Center)
- `support.html`: help page

## Publish to the Microsoft Store

1. In this repository on GitHub, open **Settings → Pages**, set the source to **Deploy from a branch**, choose `main` and `/ (root)`, and save. After a minute the app is live at `https://<your-username>.github.io/schedule-compass/`.
2. Go to [pwabuilder.com](https://www.pwabuilder.com), paste that address, and choose **Package for stores → Windows**.
3. In Partner Center, open **Schedule Compass → Product management → Product identity**. Copy **Package/Identity/Name**, **Package/Identity/Publisher** and **Package/Properties/PublisherDisplayName** into the matching PWABuilder fields. Set the version to `1.0.0.0`.
4. Download the package and upload the `.msixbundle` in the Partner Center submission under **Packages**.
5. In the submission, use `https://<your-username>.github.io/schedule-compass/privacy.html` as the privacy policy URL and `.../support.html` as the support URL.

## Updating the app

Change the files, bump `VERSION` in `sw.js` (for example `sc-1.0.1`), and push. Anyone using the web version gets the update automatically. For the Store version, rebuild in PWABuilder with a higher version number and submit an update.
