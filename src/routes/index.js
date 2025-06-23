const express = require('express');
const  v1Routes  = require('./v1');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to BranchX Admin API!' });
});

router.use('/v1',v1Routes);

module.exports = router;
