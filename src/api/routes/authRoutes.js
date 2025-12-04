import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();
/*qué hace cada línea que seleccionaste para que entiendas el flujo completo:

Cuando escribes la URL en el navegador:

router.get('/login', ...): Si escribes localhost:3000/login, esta línea le dice al servidor: "Muestra la pantalla con el formulario de login" (el archivo login.ejs).

router.get('/register', ...): Si escribes localhost:3000/register, esta línea le dice: "Muestra la pantalla de registro".

Cuando tocas el botón "Ingresar" o "Registrar":

router.post('/login', ...): Cuando llenas el formulario y das clic en "Entrar", los datos viajan por método POST. Esta línea recibe esos datos y se los pasa al controlador para verificar si la contraseña es correcta.

👉 "Si entras bien" (Login exitoso): El controlador (authController.login) te redirigirá al Dashboard (/admin/dashboard).

👉 "Si entras mal" (Contraseña incorrecta): El controlador te volverá a cargar la página de login con un mensaje de error.

En resumen: Sí, con este código tienes cubiertas tanto la vista (entrar a la página) como la acción (mandar los datos).*/
// =========================================================
//  RUTAS DE AUTENTICACIÓN (Públicas)
// =========================================================

// LOGIN
// 1. Mostrar el formulario (GET)
router.get('/login', authController.loginView);
// 2. Procesar los datos (POST)
router.post('/login', authController.login);

// REGISTRO
// 1. Mostrar el formulario (GET) <-- ESTA ES LA QUE TE FALTA O FALLA
router.get('/register', authController.registerView);
// 2. Crear el usuario (POST)
router.post('/register', authController.register);

// LOGOUT
// Cerrar sesión y destruir cookie
router.get('/logout', authController.logout);

export default router;