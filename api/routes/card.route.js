import express from "express";
import verifyUser from "../utils/verify.js";
import {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/card.controller.js";

const router = express.Router();

router.get("/", verifyUser, getAllCards);
router.post("/", verifyUser, createCard);
router.put("/:id", verifyUser, updateCard);
router.delete("/:id", verifyUser, deleteCard);

export default router;
