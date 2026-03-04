import express from "express";
import { AuthenticationMiddleware, AuthorizationMiddleware, uploadMiddleware } from "../Middleware";
import { UserController } from "../Controller";
const router = express.Router();

router.post("/", UserController.addUserWorker);
router.get("/", UserController.listUserWorker);
router.get("/:id", UserController.getUserWorker);
router.put("/:id", UserController.updateUserWorker);
router.delete("/:id", UserController.deleteUserWorker);

export default router;
