import { isValidPassword } from "../../utils/crypt.js";
import UserSchema from "../models/user.schema.js";

class UserManager {
  addUser = async (user) => {
    try {
      return await new UserSchema(user).save();
    } catch (error) {
      throw new Error(`Error al agregar el usuario: ${error.message}`);
    }
  };

  getUser = async (email) => {
    return await UserSchema.findOne({ email });
  };

  getUserByCreds = async (email, password) => {
    let user = await UserSchema.findOne({ email });
    if (isValidPassword(password, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  };

  updatePassword = async (email, password) => {
    try {
      await UserSchema.findOneAndUpdate(
        { email: email },
        { $set: { password: password } },
        { new: true }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default UserManager;
