const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { auth } = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get own user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get Token.
// @access  Public
router.post('/', [
  check('login', 'Login é obrigatório.')
  .exists(),
  check('password', 'Senha é obrigatória.')
  .exists()
], 
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // 400 - Bad Request
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
      let user = await User.findOne({ login }).select('+password');

      // See if login exists
      if(!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Credenciais Inválidas. Tem cadastro?'}] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Credenciais Inválidas.'}] });
      }

      // Return jsonwebtoken and role: isAdmin [true/false]
      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin
        }
      }

      jwt.sign(
        payload, 
        config.get('jwtSecret'),
        // Expira em 1h
        //{ expiresIn: 3600 }
        { expiresIn: 36000 },
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
      );

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error.');
    }

  });


module.exports = router;
