const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("underscore");
// middlewares
const { verifyToken } = require("../middlewares/authentication");

const app = express();

app.get("/user", [verifyToken], function (req, res) {
  let from = req.query.from || 0;
  let limit = req.query.limit || 5;
  User.find({}, "name email role google state img")
    .skip(Number(from))
    .limit(Number(limit))
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      User.count({}, (err, count) => {
        res.json({
          ok: true,
          users,
          numberOfUsers: count,
        });
      });
    });
});

app.post("/user", function (req, res) {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      user: userDB,
    });
  });
});

app.put("/user/:id", [verifyToken], function (req, res) {
  let id = req.params.id;
  // update this parameters
  let body = _.pick(req.body, ["name", "email", "img", "role", "state"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});

app.delete("/user/:id", [verifyToken], function (req, res) {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!deletedUser) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "user not found",
        },
      });
    }
    res.json({
      ok: true,
      deletedUser,
    });
  });
});

module.exports = app;
