# BitTrust Backend Railway Deployment

## Railway Setup Checklist

1. **Environment Variables**
   - Set `PORT` (Railway auto-assigns, so use `process.env.PORT` in code)
   - Set `STACKS_API`, `FRONTEND_URL`, and any secrets needed

2. **Procfile**
   - Already added: `web: npm start`

3. **Build & Start Scripts**
   - `npm run build` (compiles TypeScript)
   - `npm start` (runs built app)

4. **.env.example**
   - Use as reference for Railway environment variables

5. **CORS**
   - Already enabled in code

6. **Port Handling**
   - Code uses `process.env.PORT` (required for Railway)

7. **Ignore .env in Git**
   - `.env` is in `.gitignore` (do not commit secrets)

## Deployment Steps

1. Push your repo to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-detect build/start scripts
4. App will be available at Railway public URL

## Example API Endpoints
- `/api/reputation/:wallet`
- `/api/reputation/history/:wallet`
- `/api/leaderboard`
- `/api/reputation/update` (POST)
- `/health`

## Troubleshooting
- Check Railway logs for errors
- Ensure all required env vars are set
- Test endpoints with Postman

---
For more help, see Railway docs or ask for specific guidance.
