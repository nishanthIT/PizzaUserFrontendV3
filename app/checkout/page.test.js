// Backend endpoint: /api/complete-registration
app.post('/api/complete-registration', async (req, res) => {
  try {
    const { mobile, name, address } = req.body;

    // Find the user by mobile number
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user with additional information
    user.name = name;
    user.address = address;
    user.isProfileComplete = true; // Optional flag to track completion
    await user.save();

    // Set up session/authentication
    req.session.userId = user._id;
    req.session.isAuthenticated = true;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        isProfileComplete: user.isProfileComplete
      },
      message: 'Registration completed successfully'
    });

  } catch (error) {
    console.error('Registration completion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration completion failed' 
    });
  }
});