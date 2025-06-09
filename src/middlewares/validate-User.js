module.exports = (req, res, next) => {
  const { fullName, phone, email, country, state, city, role, businessName, message } = req.body;
  if (!fullName || !phone || !email || !country || !state || !city || !role || !businessName || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  next();
};
// This middleware checks if all required fields are present in the request body