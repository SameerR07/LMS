# GJIMT Placement LMS

A modern React + Firebase-ready Placement Cell LMS inspired by the teacher demo screenshots supplied for this project.

## What is included

- Modern GJIMT + NAAC login page using the supplied brand lockup.
- Real Firebase Email/Password authentication when Firebase is configured.
- Real Google Sign-In using Firebase Authentication when the Google provider is enabled.
- Working local demo mode before Firebase setup.
- Demo login:
  - Login ID: `demo.placement@gjimt.ac.in`
  - Password: `GJIMT@2026!`
- Six demo modules preserved and expanded:
  - Internship Coordinator
  - Placement Coordinator
  - Industrial Visits
  - Industry / Alumni Talk
  - Master Data
  - Add Student Data
- CRUD operations for each module.
- Search, status filters, refresh, edit, delete and Excel export.
- Reports / analytics page with Excel report export.
- Dark mode, mobile responsive navigation, notifications and quick navigation.
- Firestore-ready cloud data with automatic demo seeding on empty collections.
- LocalStorage fallback so the app can be demonstrated without Firebase.

## Tech stack

React 19, Vite, Firebase Authentication, Firestore, Material UI Icons, React Router and SheetJS/XLSX.

## Run locally

```bash
npm install
npm run dev
```

Then open the address shown by Vite, normally `http://localhost:5173`.

The app works immediately in Local Demo Mode using the demo credentials above.

## Real Google Login + Firebase

1. Create a Firebase project.
2. Register a Web App in the project.
3. Enable Authentication > Sign-in method > Email/Password.
4. Enable Authentication > Sign-in method > Google.
5. Create the demo user in Firebase Authentication:
   - Email: `demo.placement@gjimt.ac.in`
   - Password: `GJIMT@2026!`
6. Copy `.env.example` to `.env.local` and add the Web App config values from Firebase.
7. Create a Firestore database.
8. Publish/deploy the included `firestore.rules` after reviewing them for your college's real role model.
9. Restart Vite after editing `.env.local`.

Google sign-in needs the Google provider enabled in Firebase. Firebase's official web setup also requires registering the web app so the SDK config values are available.

See `FIREBASE_SETUP.md` for the full step-by-step guide.

## Production note

The included Firestore rules allow authenticated users to read/write records so this classroom/demo app can be connected quickly. Before publishing a real institutional portal, replace them with role-based rules (for example placement admin, coordinator, faculty and read-only student roles).

## Build for production

```bash
npm run build
npm run preview
```
