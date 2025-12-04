import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import SaleModel from '../models/SaleModel.js'; // Importamos el modelo de ventas para obtener datos reales

const mainController = {
    // 1. DASHBOARD PRINCIPAL
    // Renderiza la vista de bienvenida del panel de administración
    dashboard: (req, res) => {
        // req.session.user contiene los datos del admin logueado
        res.render('admin/dashboard', { user: req.session.user });
    },

    // 2. GENERAR REPORTE PDF
    downloadPdf: async (req, res) => {
        try {
            // Obtenemos las ventas reales de la base de datos
            const ventas = await SaleModel.findAll();

            const doc = new PDFDocument();

            // Configuramos los headers para que el navegador descargue el archivo
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte-ventas.pdf');

            // Conectamos el documento PDF con la respuesta HTTP
            doc.pipe(res);

            // --- DISEÑO DEL PDF ---
            doc.fontSize(20).text('Reporte de Ventas - Seven Burgers', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generado por: ${req.session.user.nombre}`);
            doc.text(`Fecha: ${new Date().toLocaleString()}`);
            doc.moveDown();
            doc.text('------------------------------------------------------------', { align: 'center' });
            doc.moveDown();

            // Listamos las ventas
            ventas.forEach((venta, index) => {
                doc.fontSize(14).text(`Venta #${venta.id}`);
                doc.fontSize(12).text(`Cliente: ${venta.usuario_cliente}`);
                doc.text(`Fecha: ${new Date(venta.fecha).toLocaleString()}`);
                doc.fontSize(14).text(`Total: $${venta.total}`, { align: 'right' });
                doc.moveDown();
                doc.text('-----------------------------------');
                doc.moveDown();
            });

            // Finalizamos el documento
            doc.end();

        } catch (error) {
            console.error(error);
            res.status(500).send('Error generando PDF');
        }
    },

    // 3. GENERAR REPORTE EXCEL
    downloadExcel: async (req, res) => {
        try {
            // Obtenemos las ventas reales
            const ventas = await SaleModel.findAll();

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Historial de Ventas');

            // Definimos las columnas del Excel
            sheet.columns = [
                { header: 'ID Venta', key: 'id', width: 10 },
                { header: 'Cliente', key: 'usuario_cliente', width: 30 },
                { header: 'Fecha', key: 'fecha', width: 20 },
                { header: 'Total ($)', key: 'total', width: 15 }
            ];

            // Agregamos las filas con los datos de la BD
            ventas.forEach(venta => {
                sheet.addRow({
                    id: venta.id,
                    usuario_cliente: venta.usuario_cliente,
                    fecha: new Date(venta.fecha).toLocaleDateString(),
                    total: venta.total
                });
            });

            // Estilos básicos (Negrita en la cabecera)
            sheet.getRow(1).font = { bold: true };

            // Configuramos headers para descarga
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=ventas.xlsx');

            // Escribimos el Excel en la respuesta
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error(error);
            res.status(500).send('Error generando Excel');
        }
    }
};

export default mainController;