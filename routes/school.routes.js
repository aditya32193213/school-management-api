import express from "express";
import {
  addSchool,
  listSchools,
} from "../controller/school.controller.js";

const router = express.Router();

// ➕ Add School
router.post("/addSchool", addSchool);

// 📍 List Schools
router.get("/listSchools", listSchools);

export default router;