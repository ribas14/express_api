import { Router } from "express";
import {
  validateCreationUser,
  validateUpdataUser,
  validatePassword,
  validateLogin
} from "../utils/validators";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = Router();
const { validationResult } = require("express-validator");

// GLOBAL
const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = 24 * 60 * 60;

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

router.put("/update", validateUpdataUser, async (req, res) => {
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
  } else {
    return res.status(404).send("User not found!");
  }
});

router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const user = await req.context.models.User.findByLogin(req.params.userId);
  if (user) {
    bcrypt.compare(req.body.password, user.password, function(err, res) {
      if (err) {
        return res.status(401).send("Wrong password!");
      }
      const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: EXPIRES_IN
      });
      return res.status(200).send({
        user: user,
        access_token: accessToken,
        expires_in: EXPIRES_IN
      });
    });
  } else {
    return res.status(404).send("User or email not found!");
  }
  return res.send(user);
});

router.post("/register", validateCreationUser, async (req, res) => {
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
      const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: EXPIRES_IN
      });
      return res.send({
        user: user,
        access_token: accessToken,
        expires_in: EXPIRES_IN
      });
    } catch (error) {
      return res.status(500).send("User already exist!");
    }
  });
});

router.put("/passwordChange", validatePassword, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const user = await req.context.models.User.findByPk(req.body.id);
  if (user) {
    await bcrypt.hash(req.body.password, SALT_ROUNDS, async (err, hash) => {
      user
        .update({
          password: hash
        })
        .then(function(user) {
          return res.send(user);
        })
        .catch(e => {
          console.log(e);
          return res
            .status(500)
            .send("Something went wrong updating the user!");
        });
    });
  } else {
    return res.status(404).send("User not found!");
  }
});

export default router;
