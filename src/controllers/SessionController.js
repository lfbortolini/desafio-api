const User = require("../models/User");
const yup = require("yup");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async signin(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "No body data passed. Try 'email' or 'password'" });
    }

    try {
      const { email, password } = req.body;

      const userObj = await User.findOne({
        where: { email },
      });

      if (!userObj) {
        return res.status(404).json({ error: "User already exists" });
      }

      const { id } = userObj;
      const isCheck = await userObj.checkPassword(password);

      if (isCheck) {
        const token = jwt.sign(
          {
            id,
            email,
          },
          process.env.SECRET_KEY
        );

        return res.status(200).json({
          id,
          email,
          token,
        });
      } else {
        return res.status(400).json({ error: "Invalid email or password." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to sign in" });
    }
  },
};
