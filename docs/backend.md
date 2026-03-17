# Backend Documentation

## Overview
This document provides an overview of the backend for the BitTrust project, including its structure, main components, and key functionalities.

## Folder Structure
- **src/**: Main source code for the backend
  - **config/**: Environment configuration
  - **controllers/**: API controllers (e.g., reputationController)
  - **database/**: Database connection and store logic
  - **models/**: Data models (e.g., walletScore)
  - **routes/**: API route definitions
  - **services/**: Business logic and integrations (blockchain, leaderboard, scoring)
  - **utils/**: Utility functions (logger, trustLevel)
- **package.json**: Backend dependencies and scripts
- **tsconfig.json**: TypeScript configuration

## Key Files
- **index.ts**: Entry point for the backend server
- **reputationController.ts**: Handles reputation-related API requests
- **blockchainService.ts**: Interacts with blockchain components
- **scoringEngine.ts**: Calculates trust/reputation scores

## How to Run
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start the backend server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `/reputation` - Get and update reputation scores
- `/leaderboard` - View leaderboard data

## Environment Variables
Configure environment variables in `config/env.ts` as needed for database, blockchain, and other integrations.

## Additional Notes
- Logging is handled via `utils/logger.ts`.
- Trust level calculations are in `utils/trustLevel.ts`.

---
For more details, refer to the inline comments in each file or contact the backend maintainers.
