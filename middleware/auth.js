const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = {
  auth: (req, res, next) => {
    // Get Token from header
    const token = req.header('x-auth-token');

    // Check if not token, return 401 - Not Authorized
    if (!token) {
      return res.status(401).json({
        msg: 'Sem token, autorização negada.'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));

      // Using this req."variable" but some docs recommends res.locals."variable"
      // req.user will have entire JWT content from user{ id, isAdmin, name, etc }
      req.user = decoded.user;
      next();

    } catch (err) {
      res.status(401).json({
        msg: 'O Token não é válido.'
      })
    }
  },

  // authorize: (...rolesAuthorized) => {
  //   return (req, res, next) => {
  //     if(!rolesAuthorized.includes(req.user.role)) {
  // Atenção: Ao invés de usar da forma acima, onde você cita quais roles são autorizados
  // decidi criar um authorizedAdmin, onde já testa se é ou não Admin.
  // Caso o cliente necessite de "roles" mais que Admin vs Usuário, podemos usar o formato acima.
  onlyAdmin: (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        msg: 'Usuário sem permissão.'
      });
    }
    next();
  }
}
