import express from "express";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.route("/")
  .get(getTransactions)
  .post(createTransaction);

router.route("/:id")
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
