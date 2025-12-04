import express from 'express';

// Importamos los archivos de rutas individuales
// Recuerda usar .js al final de cada import en ES Modules
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import saleRoutes from './saleRoutes.js';
import reportRoutes from './reportRoutes.js'; // <--- Aquí importamos las rutas de reportes

const router = express.Router();

// =========================================================
//  CONEXIÓN DE RUTAS
// =========================================================

// Rutas de Autenticación (Login, Registro)
router.use('/', authRoutes);

// Rutas de Productos (API Kiosco y Admin Dashboard)
router.use('/', productRoutes);

// Rutas de Ventas (Para confirmar compras)
router.use('/', saleRoutes);

// Rutas de Reportes (PDF y Excel)
router.use('/', reportRoutes); // <--- Aquí las activamos


// =========================================================
//  REDIRECCIÓN INICIAL
// =========================================================
// Si entran a la raíz (localhost:3000), los mandamos al login
router.get('/', (req, res) => {
    res.redirect('/login');
});

export default router;