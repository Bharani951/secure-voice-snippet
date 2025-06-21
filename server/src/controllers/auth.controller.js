// Add these logs in your register controller
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Register request received:", { name, email });

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log("User already exists:", email);
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create new user
  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("User created successfully:", user._id);

    // Rest of your code...
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});
