import UserSchema from "../models/user.schema.js";

class UserManager {
  addUser = async (user) => {
    try {
      await UserSchema.create(user);
      return user;
    } catch (error) {
      throw new Error(`Error al agregar el usuario: ${error.message}`);
    }
  };

  getUser = async (email) => {
    return await UserSchema.findOne({ email });
  };

  getUserByCreds = async (email, password) => {
    return await UserSchema.findOne({ email, password });
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
