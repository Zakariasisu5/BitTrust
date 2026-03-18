import { Router } from "express";
import {
  getLeaderboardHandler,
  getReputation,
  getReputationHistory,
  postUpdateReputation,
} from "../controllers/reputationController";
import {
  postLinkProvider,
  deleteUnlinkProvider,
  getWalletVerification,
} from "../controllers/verificationController";

const router = Router();

router.get("/reputation/:wallet", getReputation);
router.post("/reputation/update", postUpdateReputation);
router.get("/reputation/history/:wallet", getReputationHistory);
router.get("/leaderboard", getLeaderboardHandler);

// Identity verification
router.get("/verification/:wallet", getWalletVerification);
router.post("/verification/link", postLinkProvider);
router.delete("/verification/unlink", deleteUnlinkProvider);

export default router;

