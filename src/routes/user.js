import { Router } from "express";
import { validateCreationUser, validateUpdataUser } from "../utils/validators";

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

router.delete("/:userId", async (req, res) => {
  const user = await req.context.models.User.destroy({
    where: {
      id: req.params.userId
    }
  });
  return res.send("User deleted!");
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

router.put("/", validateUpdataUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const user = await req.context.models.User.findByPk(req.body.id);
  if (user) {
    user
      .update({
        username: req.body.username,
        email: req.body.email,
        admin: req.body.admin,
        pic: req.body.pic
      })
      .then(function(user) {
        return res.send(user);
      })
      .catch(e => {
        console.log(e);
        return res.status(500).send("Something went wrong updating the user!");
      });
  }
});

export default router;
