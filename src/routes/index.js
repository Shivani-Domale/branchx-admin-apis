const express = require('express');
const router = express.Router();

// Example default route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to BranchX Admin API!' });
});

module.exports = router;
