import validator from "validator";

export const validateUser = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  }

  if (!password || password.trim().length < 4) {
    throw new Error("Password must be at least 4 characters long.");
  }
};
