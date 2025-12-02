const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, age, gender, hospitalName, licenseId, specialization } = req.body;

    console.log('📝 Registration request:', { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user object based on role
    const userData = {
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: role.toUpperCase(),
      phone,
    };

    if (role.toUpperCase() === 'PATIENT') {
      userData.age = age;
      userData.gender = gender;
    }

    if (role.toUpperCase() === 'HOSPITAL') {
      userData.hospitalName = hospitalName;
      userData.licenseId = licenseId;
      userData.specialization = specialization;
    }

    // Create user
    const user = await User.create(userData);
    
    // Generate token
    const token = generateToken(user._id);

    console.log('✅ User created successfully:', { id: user._id, email: user.email, role: user.role });

    // Return token and user data
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('📝 Login request:', { email, role });

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if role matches
    if (role && user.role !== role.toUpperCase()) {
      console.log('❌ Role mismatch:', { expected: role, actual: user.role });
      return res.status(401).json({ message: 'Invalid credentials for this role' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Login successful:', { id: user._id, email: user.email, role: user.role });

    // Return token and user data in CORRECT format
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Validate token
// @route   GET /api/auth/validate
exports.validateToken = async (req, res) => {
  try {
    // req.user is set by auth middleware
    if (req.user) {
      return res.json({ valid: true, user: req.user });
    }
    res.status(401).json({ valid: false });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};