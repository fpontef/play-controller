const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { auth } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');


const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User 
// @access  Public
router.post('/', [
  check('name', 'Nome é obrigatório.')
  .not()
  .isEmpty(),
  check('login', 'Login é obrigatório.')
  .not()
  .isEmpty(),
  check('password', 'Por favor inclua uma senha com 6 ou mais caracteres.')
  .isLength({ min: 6 }),
  check('isAdmin', 'É necessário marcar a opção de administrativo.')
  .not()
  .isEmpty()
], 
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // 400 - Bad Request
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, login, password, isAdmin } = req.body;

    try {
      let user = await User.findOne({ login });

      // See if login exists
      if(user) {
        return res.status(400).json({ errors: [{ msg: 'Nome de Login já existe'}] });
      }

      user = new User({
        name,
        login,
        password,
        isAdmin 
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      
      // Return jsonwebtoken
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

// @route   PUT api/users
// @desc    Edit User Name and Password
// @access  Private
// FALTA TERMINARRRRRRRRRRRRRR
router.put('/', [
  auth,
  check('name', 'Nome é obrigatório.')
  .not()
  .isEmpty(),
  check('password', 'Por favor inclua uma senha com 6 ou mais caracteres.')
  .isLength({ min: 6 })
],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // 400 - Bad Request
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      name,
      password,
    } = req.body;
    
    try {   
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      
      passwordEncrypted = await bcrypt.hash(password, salt);
      
      const newData = {
        name,
        password: passwordEncrypted
      };
      
      const user = await User.findByIdAndUpdate(req.user.id, newData, { new: true })
      
      res.json(user);
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error.');
    }
  });


module.exports = router;
