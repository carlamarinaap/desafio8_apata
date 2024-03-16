import bcrypt from "bcrypt";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);
