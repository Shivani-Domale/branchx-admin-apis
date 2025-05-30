const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');

// Register a new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('email:', email);
    console.log('password:', password);

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login an admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's the Org Admin
    if (email === ServerConfig.ORG_ADMIN_EMAIL && password === ServerConfig.ORG_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: 'ORG_ADMIN' },
        ServerConfig.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ message: 'Org Admin login successful', token });
    }

    // check DB for regular admins
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      console.log('Login Email:', email);
      console.log('Expected Org Admin Email:', ServerConfig.ORG_ADMIN_EMAIL);
      console.log('Password:', password);
      console.log('Expected Org Admin Password:', ServerConfig.ORG_ADMIN_PASSWORD);

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      ServerConfig.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};