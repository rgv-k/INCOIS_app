const jwt = require('jsonwebtoken');
// Updated auth middleware
/**
 * @param {Object} req -express req
 * @param {Object} res - express response
 * @param {Function} next 
 */
module.exports = function(req, res, next) 
{
  
  const token = req.header('x-auth-token');
  if (!token) 
{
    return res.status(401).json({ message: 'No token, authorization denied' });
}
  
  try 
{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
} 
  catch (err) 
  {
    res.status(401).json({ message: 'Token is not valid' });
  }
};