const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};