import config from "../config.js";
import { emailFormatChecker } from "../helperFunctions/checker.js";
import { mailer } from "../helperFunctions/mailer.js";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//User Registration
export const userRegister = async (request, response, next) => {
  try {
    if (!emailFormatChecker(request.body.email)) {
      response.status(530);
      return next(new Error("Invalid Email address."));
    }
    const user = await userModel.findOne({
      email: request.body.email,
    });
    if (user !== null) {
      response.status(409);
      return next(new Error("Email already registered"));
    }
    const hashedPassword = await bcrypt.hash(
      request.body.password,
      config.saltValue
    );
    const newUser = await new userModel({
      userName: request.body.userName,
      email: request.body.email,
      password: hashedPassword,
    }).save();
    if (newUser?._id) {
      const payload = {
        id: newUser._id,
        userName: newUser.userName,
        password: newUser.password,
      };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
      return response.status(200).json({
        userDetails: newUser,
        token: token,
        message: "User has been registered succesfully",
        success: true,
      });
    } else {
      return next(new Error("Failed to register user"));
    }
  } catch (error) {
    return next(error);
  }
};

//User Login
export const userLogin = async (request, response, next) => {
  try {
    if (!emailFormatChecker(request.body.email)) {
      response.status(530);
      return next(new Error("Invalid email address"));
    }
    const user = await userModel.findOne({
      email: request.body.email,
    });
    if (user === null) {
      response.status(401);
      return next(new Error("User not found."));
    } else {
      if (await bcrypt.compare(request.body.password, user.password)) {
        const payload = {
          id: user._id,
          userName: user.userName,
          password: user.password,
        };
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
        return response.status(200).json({
          userDetails: user,
          token: token,
          message: "valid user",
          success: true,
        });
      } else {
        response.status(401);
        return next(new Error("Wrong Password."));
      }
    }
  } catch (error) {
    return next(error);
  }
};

//get all users
export const allUsersData = async (request, response, next) => {
  try {
    const users = await userModel.find();
    return response.status(200).json({
      data: users,
      message: "User details.",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

//send-reset-password mail
export const setPassword = async (request, response, next) => {
  try {
    if (!emailFormatChecker(request.body.email)) {
      response.status(530);
      return next(new Error("Invalid email address"));
    }
    const user = await userModel.findOne({
      email: request.body.email,
    });
    if (user === null) {
      response.status(401);
      return next(new Error("User not found."));
    }
    const secret = config.jwtSecret + user.password;
    const payload = {
      email: request.body.email,
      id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "5m" });
    const link = `http://localhost:3000/user/reset-password/${user._id}/${token}`;
    const mail = mailer(request.body.email, link);
    return response.status(200).json({
      data: null,
      message: "Email send successfully",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

//reset link validation
export const resetPasswordVerification = async (request, response, next) => {
  const { id, token } = request.params;
  try {
    const user = await userModel.findOne({
      _id: id,
    });
    const secret = config.jwtSecret + user.password;
    try {
      jwt.verify(token, secret);
      return response.status(200).json({
        data: { email: user.email },
        message: "User verified for reset password",
        success: true,
      });
    } catch (error) {
      response.status(403);
      return next(
        new Error("Not authenticated to reset password. Please try again")
      );
    }
  } catch (error) {
    next(error);
  }
};

//forget password
export const forgetPassword = async (request, response, next) => {
  try {
    if (!emailFormatChecker(request.body.email)) {
      response.status(530);
      return next(new Error("Invalid email address"));
    }
    const user = await userModel.findOne({ email: request.body.email });
    if (await bcrypt.compare(request.body.newPassword, user.password)) {
      response.status(400);
      return next(new Error("Old password can not be same as new password!"));
    }
    const secret = config.jwtSecret + user.password;
    try {
      const payload = jwt.verify(request.body.token, secret);
      const responseAfterUpdate = await userModel.findOneAndUpdate(
        {
          _id: payload.id,
        },
        {
          $set: {
            password: await bcrypt.hash(
              request.body.newPassword,
              config.saltValue
            ),
          },
        },
        { new: true }
      );
      if (responseAfterUpdate?._id) {
        return response.status(200).json({
          data: null,
          message: "Password reset successfully.",
          status: 200,
          success: true,
        });
      } else {
        response.status(401);
        return next(new Error("Failed to reset password. Please try again."));
      }
    } catch (error) {
      response.status(403);
      return next(new Error("Token validation failed."));
    }
  } catch (error) {
    return next(error);
  }
};
