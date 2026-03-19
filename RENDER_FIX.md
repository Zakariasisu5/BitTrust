# URGENT: Render Start Command Fix

## Problem

The backend is deploying successfully but returning 404 errors because Render is trying to run `node dist/index.js` but the compiled files are actually in `dist/src/index.js`.

## Root Cause

The TypeScript compiler outputs files to `dist/src/` (preserving the source structure) but the start command was pointing to `dist/index.js`.

## Solution

### Step 1: Update Render Start Command

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your `bittrust-backend` service
3. Go to **Settings** → **Build & Deploy**
4. Update the **Start Command** to:
   ```
   node dist/src/index.js
   ```
5. Click **Save Changes**

### Step 2: Redeploy

1. Click **Manual Deploy** → **Deploy latest commit**
2. Wait for deployment to complete
3. Test the endpoints

## Verification

After redeployment, test these endpoints:

```bash
# Health check
curl https://bittrust-backend.onrender.com/health

# Verification endpoint
curl https://bittrust-backend.onrender.com/api/verification/SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT
```

Expected response for verification:
```json
{
  "wallet": "SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT",
  "providers": [],
  "totalBonus": 0
}
```

## What Was Fixed Locally

- ✅ Updated `package.json` main field: `"main": "dist/src/index.js"`
- ✅ Updated `package.json` start script: `"start": "node dist/src/index.js"`
- ✅ Verified all files compile correctly including verification endpoints
- ✅ Confirmed routes are properly registered

## Files Changed

- `backend/package.json` - Updated main and start paths

## Next Steps

1. Commit and push these changes:
   ```bash
   git add backend/package.json
   git commit -m "Fix: Update start command path to dist/src/index.js"
   git push origin main
   ```

2. Update Render start command (see Step 1 above)

3. Redeploy on Render

The verification endpoints will work after this fix is deployed.
