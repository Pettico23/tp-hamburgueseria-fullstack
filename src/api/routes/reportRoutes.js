import express from 'express';
import mainController from '../controllers/mainController.js';
import isAuth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/admin/reportes/pdf', isAuth, mainController.downloadPdf);
router.get('/admin/reportes/excel', isAuth, mainController.downloadExcel);

export default router;