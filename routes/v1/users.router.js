const express = require('express');
const router = express.Router();
const userService = require('../../services1/userService');

router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    
    // Validación de campos
    if (!name?.trim() || !email?.trim() || !username?.trim() || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Formato de correo electrónico inválido' 
      });
    }

    const user = await userService.registerUser({ 
      name, 
      email, 
      username, 
      password 
    });

    res.status(201).json({ 
      message: 'Usuario registrado con éxito',
      user
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(error.message.includes('ya está registrado') ? 409 : 500)
       .json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username?.trim() || !password) {
      return res.status(400).json({ 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    const { token, user } = await userService.loginUser(username, password);

    res.status(200).json({ 
      message: 'Inicio de sesión exitoso',
      token,
      user
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(401).json({ 
      error: error.message 
    });
  }
});

router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email?.trim()) {
      return res.status(400).json({ 
        error: 'El correo electrónico es requerido' 
      });
    }

    const user = await userService.findUserByEmail(email);
    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error('Error al verificar el correo electrónico:', error);
    res.status(500).json({ 
      error: 'Error al verificar el correo electrónico' 
    });
  }
});

module.exports = router;