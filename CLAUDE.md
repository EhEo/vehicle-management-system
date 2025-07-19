# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vehicle Management System - A Next.js 15 application for tracking employee transportation, built with React 19, TypeScript, and Firebase Firestore for real-time data synchronization.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Deploy to Firebase
npm run deploy:firebase

# Deploy to Vercel (production)
vercel --prod
```

## Architecture Overview

### Core Stack
- **Next.js 15.3.5** with App Router and Turbopack
- **React 19** with TypeScript 5 (strict mode)
- **Firebase Firestore** for real-time database
- **Tailwind CSS v4** for styling

### Key Architectural Decisions

1. **Service Layer Pattern**: All Firestore operations are centralized in `src/lib/firestore.ts`. When adding new features, extend this service rather than accessing Firestore directly in components.

2. **Real-time Subscriptions**: Components use `onSnapshot` for live updates. Always clean up subscriptions in `useEffect` return functions.

3. **Type Safety**: All data models have TypeScript interfaces in `src/types/`. Always update these when modifying data structures.

4. **No Authentication**: Currently no user auth system. All users have full access to all data.

5. **Daily Reset System**: Automated reset runs at 5 AM Vietnam time (UTC+7) via Vercel cron (22:00 UTC). Processes **previous day's** departure records and resets vehicle/employee status. Manual reset available at `/api/reset`.

### Data Flow
```
Component → Firestore Service → Firebase → Real-time Update → All Connected Clients
```

### Environment Setup

Create `.env.local` with Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
CRON_SECRET= # For Vercel cron authentication
```

## Key Files and Patterns

### Service Layer (`src/lib/firestore.ts`)
- `getEmployees()`, `updateEmployee()` - Employee CRUD
- `getVehicles()`, `updateVehicle()` - Vehicle management
- `getLeaveRecords()`, `updateLeaveRecord()` - Leave tracking
- `resetDailyData()` - Daily reset logic

### API Routes
- `/api/cron/reset` - Automated daily reset (Vercel cron)
- `/api/reset` - Manual reset endpoint
- `/api/debug/*` - Development debugging endpoints

### Component Patterns
```typescript
// Standard real-time data pattern
useEffect(() => {
  const unsubscribe = onSnapshot(query, (snapshot) => {
    // Handle updates
  });
  return () => unsubscribe();
}, []);
```

### State Updates
Components handle local state with `useState` and sync with Firestore. No global state management library is used.

## Testing

Currently no test framework is configured. When adding tests:
1. Consider Jest + React Testing Library for unit tests
2. Consider Playwright for E2E tests
3. Test Firestore operations with Firebase emulator

## Deployment

### Vercel (Primary)
- Auto-deploys from main branch
- Cron job configured in `vercel.json`
- Environment variables set in Vercel dashboard

### Firebase Hosting
```bash
npm run export
firebase deploy
```

### Netlify
- Configuration in `netlify.toml`
- Set environment variables in Netlify dashboard

## Common Development Tasks

### Adding a New Feature
1. Define TypeScript types in `src/types/`
2. Add service methods to `src/lib/firestore.ts`
3. Create UI components with real-time subscriptions
4. Update navigation if needed

### Modifying Daily Reset
1. Update `dailyReset()` in `src/lib/reset.ts`
2. Test with `/api/reset` endpoint
3. Verify cron timing in `vercel.json` (currently 22:00 UTC = 5 AM Vietnam)
4. System processes **previous day's records** using Vietnam timezone (UTC+7)

### Debugging Firestore
- Use `/api/debug/*` endpoints during development
- Check Firebase Console for real-time data
- Monitor browser console for subscription errors

## Important Notes

- **Time Zone**: System operates on Vietnam time (UTC+7)
- **Language**: UI is in Korean, codebase in English
- **PWA**: Configured with manifest and icons for mobile use
- **No Testing**: No automated tests currently exist
- **Security**: Firestore rules in `firestore.rules` - review before production