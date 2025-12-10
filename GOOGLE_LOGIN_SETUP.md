# Google Login Setup Guide

## Quick Setup (3 Steps)

### 1. Get Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API" or "Google Identity Services"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add your domain to "Authorized JavaScript origins"
7. Copy your **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

### 2. Update the Client ID
Open `assets/js/auth/googleAuth.js` and replace:
```javascript
client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
```
With your actual Client ID:
```javascript
client_id: '123456789-abc.apps.googleusercontent.com',
```

### 3. Add Script to Other HTML Pages
Add this line before the `sesion.js` script in all HTML pages that have login:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

**Already added to:**
- ✅ `ES/index.html`
- ✅ `EN/index.html`

**Add to other pages like:**
- `ES/sesion.html`
- `ES/producto-detalle.html`
- `EN/session.html`
- Any other page with login modal

## How It Works

1. **User clicks Google Sign-In button** → Google shows login popup
2. **User signs in** → Google returns user info (name, email, picture)
3. **System saves to localStorage** → Same as regular login, but with `provider: 'google'`
4. **User is logged in** → Works exactly like users from `users.json`

## Features

- ✅ Works alongside existing `users.json` system
- ✅ Google users saved to localStorage (same format)
- ✅ Simple code, easy to understand
- ✅ No backend needed (all client-side)
- ✅ Supports both ES and EN languages

## Notes

- Google users are **NOT** added to `users.json` file
- They're stored in browser localStorage only
- Each browser/device will have separate Google login
- To persist across devices, you'd need a backend (future feature)

## Testing

1. Open your site
2. Click login button
3. You should see "or" divider and Google button
4. Click Google button → Sign in with Google
5. Should redirect and show you as logged in!

