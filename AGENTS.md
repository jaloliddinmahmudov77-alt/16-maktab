# Sardoba 16-Maktab Project Instructions

## CRITICAL: USER DATA PRESERVATION MANDATE
- **STRICT PROHIBITION**: NEVER overwrite, wipe, reset, or delete the user's data in `storage.json`, `storage.backup.json`, or the client-side state.
- **NEVER** revert user-customized information (such as school details, principal info, background image `heroBgImage`, news items, photos, videos, teachers, or contacts) back to initial template defaults.
- When performing changes, adding new features, editing code, or restarting the dev server:
  - ALWAYS preserve existing records in `storage.json`.
  - NEVER run commands or write code that flushes or truncates `storage.json`.
  - Maintain compatibility with all stored data properties.
