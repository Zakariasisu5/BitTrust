import { Router } from "express";
import {
  getLeaderboardHandler,
  getReputation,
  getReputationHistory,
  postUpdateReputation,
} from "../controllers/reputationController";

const router = Router();

router.get("/reputation/:wallet", getReputation);
router.post("/reputation/update", postUpdateReputation);
router.get("/reputation/history/:wallet", getReputationHistory);
router.get("/leaderboard", getLeaderboardHandler);

export default router;

