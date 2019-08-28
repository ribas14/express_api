import { Router } from "express";
import { validateCreationUser } from "../utils/validators";

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const router = Router();
const { validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  return res.send(user);
});

router.post("/", validateCreationUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  await bcrypt.hash(req.body.password, SALT_ROUNDS, async (err, hash) => {
    try {
      const user = await req.context.models.User.create({
        username: req.body.username,
        email: req.body.email,
        admin: req.body.admin,
        password: hash,
        pic: req.body.pic
      });
      return res.send(user);
    } catch (error) {
      console.log("error");
      console.log(error);
      return res.status(500).send("User already exist!");
    }
  });
});

export default router;
