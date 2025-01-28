// middleware/authenticateJWT.js
// middleware/authenticateJWT.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authorization header must start with Bearer' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId)
      .select('_id username name'); // Only select needed fields
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado o desactivado' 
      });
    }

    // Attach minimal user info to request
    req.user = {
      userId: user._id,
      username: user.username,
      name: user.name
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    return res.status(500).json({ 
      error: 'Error en la autenticación' 
    });
  }
};

module.exports = authenticateJWT;