require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  login(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (decoded) {
          return next();
        } else {
          return res.status(401).json({ message: "User not authenticated." });
        }
      });
    } catch (err) {
      return res.status(404).json({ error: "Failed to login" });
    }
  },

  correctUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (decoded && String(decoded.id) === String(req.body.user_id)) {
          return next();
        } else {
          return res.status(401).json({ message: "User invalid" });
        }
      });
    } catch (err) {
      return res.status(404).json({ error: "Failed to login" });
    }
  },

  userAdmin(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (decoded && decoded.id) {
          const user = await User.findByPk(decoded.id);

          if (user && user.role === "admin") {
            return next();
          } else {
            return res
              .status(401)
              .json({ message: "Unauthorized. User is not a admin." });
          }
        }
      });
    } catch (err) {
      return res.status(404).json({ error: "Failed to login" });
    }
  },
};
