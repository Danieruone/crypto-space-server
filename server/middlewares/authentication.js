const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  let token = req.get("Authorization");
  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.user = decoded.user;
    next();
  });
};

let verifyAdminRole = (req, res, next) => {
  let user = req.user;
  if (user.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: "this role is not authorized",
      },
    });
  }
};

module.exports = { verifyToken, verifyAdminRole };
