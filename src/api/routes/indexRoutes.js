import express from 'express';
/*¿Qué hace este archivo?
Importa las rutas específicas que creaste antes (authRoutes.js y productRoutes.js).

Usa router.use() para decirle a Express que incluya esas rutas en la aplicación.

Redirige la ruta raíz / al login, para que el usuario no vea una página en blanco o un error al entrar por primera vez.

Con este archivo, tu index.js principal queda mucho más limpio, ya que solo necesita importar este indexRoutes.js para tener acceso a todas las rutas de la aplicación.*/ 

// Importamos los submódulos de rutas
// Recuerda: En ES Modules siempre debes incluir la extensión .js
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

// =========================================================
//  UNIFICACIÓN DE RUTAS
// =========================================================

// Usamos las rutas de autenticación (Login, Register, Logout)
// Estas rutas estarán disponibles en la raíz, por ejemplo: /login, /register
router.use('/', authRoutes);

// Usamos las rutas de productos (API y Panel de Admin)
// Estas rutas también se montan en la raíz y se definen dentro de productRoutes.js
// Ejemplo: /api/products, /admin/dashboard
router.use('/', productRoutes);


// =========================================================
//  REDIRECCIÓN RAÍZ
// =========================================================
// Si alguien entra a la raíz del sitio (localhost:3000), 
// lo redirigimos automáticamente a la pantalla de inicio de sesión.
// Puedes cambiar esto para que redirija a una landing page si prefieres.
router.get('/', (req, res) => {
    res.redirect('/login');
});

export default router;