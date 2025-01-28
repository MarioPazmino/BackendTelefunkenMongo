// services/userService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userService = {
  async registerUser(userData) {
    const { name, email, username, password } = userData;

    // Verificar email y username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('El correo electrónico ya está registrado');
      }
      throw new Error('El nombre de usuario ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await user.save();
    
    // Eliminar el password antes de devolver el usuario
    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  },

  async loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;
    return { token, user: userResponse };
  },

  async findUserByEmail(email) {
    return await User.findOne({ email }).select('-password');
  },

  async findUserByUsername(username) {
    return await User.findOne({ username }).select('-password');
  }
};

module.exports = userService;