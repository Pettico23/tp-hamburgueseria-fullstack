import express from 'express';
import productController from '../controllers/productController.js';

// Importamos Middlewares
// IMPORTANTE: Asegúrate de que estas líneas estén SOLO UNA VEZ
import isAuth from '../middlewares/authMiddleware.js';     
import upload from '../middlewares/uploadMiddleware.js';   

const router = express.Router();

// =========================================================
//  API (Para el Kiosco / Frontend) - Devuelve JSON
// =========================================================
router.get('/api/products', productController.apiList);


// =========================================================
//  ADMINISTRACIÓN (Panel de Control) - Requiere Login
// =========================================================

// 1. DASHBOARD
// CORRECCIÓN: Cambiamos .adminList por .dashboard para coincidir con el controlador
router.get('/admin/dashboard', isAuth, productController.dashboard);

// 2. CREAR PRODUCTO
router.get('/admin/productos/crear', isAuth, productController.createView);
router.post('/admin/productos', isAuth, upload.single('imagen'), productController.create);

// 3. EDITAR PRODUCTO
router.get('/admin/productos/:id/editar', isAuth, productController.editView);
router.put('/admin/productos/:id', isAuth, upload.single('imagen'), productController.update);

// 4. ELIMINAR PRODUCTO
router.delete('/admin/productos/:id', isAuth, productController.delete);

export default router;