import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

// =========================================================
//  RUTAS DE VENTAS
// =========================================================

// POST /api/ventas -> Recibe el pedido del Kiosco y lo guarda
router.post('/api/ventas', saleController.createSale);

export default router;