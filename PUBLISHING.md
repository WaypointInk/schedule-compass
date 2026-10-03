# Publishing the iPhone / iPad app

The "Build iPhone app" workflow builds Schedule Compass on a GitHub Mac, signs it with
Apple's cloud signing, and uploads it to App Store Connect (TestFlight). No Mac needed.

## Part 1 — Apple Developer account
Join the Apple Developer Program (developer.apple.com/programs, $99/year).

## Part 2 — Create the app in App Store Connect
1. developer.apple.com → Certificates, Identifiers & Profiles → Identifiers → **+** →
   App IDs → App. Bundle ID (Explicit): `com.waypointink.schedulecompass`.
2. appstoreconnect.apple.com → Apps → **+** → New App. Platform iOS, name
   "Schedule Compass", pick that Bundle ID, SKU `schedule-compass`.

## Part 3 — API key and the four GitHub secrets
If you already made an API key for Table Compass, reuse it: the same four values work here.
Secrets belong to one repository, so add them again in this one.

In App Store Connect → Users and Access → Integrations → App Store Connect API →
Team Keys, generate a key with **Admin** access (cloud signing needs Admin).
Download the `.p8` file. You can only download it once.

On GitHub: repo → Settings → Secrets and variables → Actions → New repository secret.
Each secret goes in its own box:

| Secret name          | What goes in it                                                    | Looks like |
|----------------------|--------------------------------------------------------------------|------------|
| `APPLE_TEAM_ID`      | Team ID (developer.apple.com → Account → Membership details)       | `AB12CD34EF` |
| `APPSTORE_KEY_ID`    | The Key ID shown next to the key. Only these 10 characters.        | `ZX98YW76VU` |
| `APPSTORE_ISSUER_ID` | The Issuer ID shown above the list of keys                         | `69a6de70-03db-47e3-e053-5b8c7c11a4d1` |
| `APPSTORE_API_KEY`   | The whole text of `AuthKey_XXXXXXXXXX.p8`, BEGIN and END lines included | `-----BEGIN PRIVATE KEY-----` … |

The workflow's first step checks all four and tells you which one is wrong.

## Part 4 — Build and upload
Actions → **Build iPhone app** → Run workflow → type the version (1.0.0 first, then
1.0.1, 1.0.2 … for updates). About 15 minutes later the build appears in App Store
Connect → TestFlight. Install it on your phone with the TestFlight app, then submit it
for review from the app's page in App Store Connect.

The build number is set automatically (run number, plus the attempt number when a run is retried),
so re-running a failed run never clashes with an earlier upload.
