const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production', {
    expiresIn: '30d',
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, hospitalName, hospitalAddress, licenseNumber } = req.body;

    console.log('📝 Registration request:', { email, role });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role,
      phone,
    };

    // Add hospital-specific fields
    if (role === 'HOSPITAL') {
      userData.hospitalName = hospitalName;
      userData.hospitalAddress = hospitalAddress;
      userData.licenseNumber = licenseNumber;
    }

    const user = await User.create(userData);

    console.log('✅ User registered:', { id: user._id, email: user.email, role: user.role });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        hospitalName: user.hospitalName,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('📝 Login request:', { email });

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', { id: user._id, email: user.email, role: user.role });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        hospitalName: user.hospitalName,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Validate token
exports.validateToken = async (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};