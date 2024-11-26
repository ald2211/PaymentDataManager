import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/customError.js";

// Register
// export const register = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     let user = await User.findOne({ email });
//     if (user) return next(errorHandler(400, "Email already registered"));

//     const salt = await bcrypt.genSalt(10);
//     let hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({ email, password: hashedPassword });
//     await user.save();

//     const payload = { user: { id: user.id } };
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" },
//       (err, token) => {
//         if (err) {
//           console.log("error at token creation:", err);
//           return next(
//             errorHandler(err.statusCode, "Sign in Failed please try again")
//           );
//         }
//         const { password, ...rest } = user._doc;
//         res
//           .status(200)
//           .json({ success: true, message: "welcome", userData: rest, token });
//       }
//     );
//   } catch (error) {
//     console.log("ee", error.message);
//     next(error);
//   }
// };

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return next(errorHandler(400, "Invalid credentials"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(errorHandler(400, "Invalid credentials"));

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          console.log("login err:", err);
          return next(errorHandler(400, "login failed"));
        }
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .json({ success: true, message: "welcome", userData: rest, token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
