const isAuth = (req, res, next) => {
    // Verificamos si existe un usuario guardado en la sesión
    // (Esto se crea cuando haces login exitoso en authController)
    if (req.session.user) {
        // Si existe, el usuario está autorizado. Dejamos pasar la petición.
        return next();
    }
    
    // Si no hay usuario en sesión, redirigimos al login
    console.log('⛔ Acceso denegado: Usuario no autenticado');
    return res.redirect('/login');
};

export default isAuth;