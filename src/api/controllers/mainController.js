import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import SaleModel from '../models/SaleModel.js'; // Importamos el modelo para obtener datos reales

const mainController = {
    // 1. DASHBOARD PRINCIPAL
    // Renderiza la vista de bienvenida del panel de administración
    dashboard: (req, res) => {
        // req.session.user contiene los datos del admin logueado
        res.render('admin/dashboard', { user: req.session.user });
    },

    // 2. GENERAR REPORTE PDF (Detallado)
    downloadPdf: async (req, res) => {
        try {
            // Obtenemos las ventas reales de la base de datos con sus detalles
            const filas = await SaleModel.findAllWithDetails();

            const doc = new PDFDocument();

            // Configuramos los headers para que el navegador descargue el archivo
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte-ventas.pdf');

            // Conectamos el documento PDF con la respuesta HTTP
            doc.pipe(res);

            // --- ENCABEZADO DEL PDF ---
            doc.fontSize(20).text('Reporte de Ventas - Seven Burgers', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generado por: ${req.session.user.nombre}`);
            doc.text(`Fecha de emisión: ${new Date().toLocaleString()}`);
            doc.moveDown();
            doc.text('------------------------------------------------------------', { align: 'center' });
            doc.moveDown();

            // --- CUERPO DEL REPORTE ---
            // Agrupamos visualmente por venta
            let ventaActualId = null;

            filas.forEach((fila) => {
                // Si cambiamos de ID de venta, imprimimos una nueva cabecera de venta
                if (ventaActualId !== fila.venta_id) {
                    if (ventaActualId !== null) { 
                        doc.moveDown(); 
                        doc.text('------------------------------------------------------------', { align: 'center' });
                        doc.moveDown(); 
                    }
                    
                    ventaActualId = fila.venta_id;
                    
                    // Datos de la Venta (Cabecera)
                    doc.font('Helvetica-Bold').fontSize(14).text(`Venta #${fila.venta_id} - Cliente: ${fila.usuario_cliente}`);
                    doc.font('Helvetica').fontSize(10).fillColor('gray').text(`Fecha: ${new Date(fila.fecha).toLocaleString()}`);
                    doc.moveDown(0.5);
                }

                // Datos del Producto (Detalle)
                doc.fontSize(12).fillColor('black')
                   .text(`• ${fila.cantidad}x ${fila.nombre_producto}  -  $${fila.precio_unitario} c/u`);
            });

            // Finalizamos el documento
            doc.end();

        } catch (error) {
            console.error('Error generando PDF:', error);
            res.status(500).send('Error generando PDF');
        }
    },

    // 3. GENERAR REPORTE EXCEL (Completo)
    downloadExcel: async (req, res) => {
        try {
            // Obtenemos las ventas reales
            const filas = await SaleModel.findAllWithDetails();

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Historial de Ventas');

            // Definimos las columnas del Excel
            sheet.columns = [
                { header: 'ID Venta', key: 'id', width: 10 },
                { header: 'Cliente', key: 'cliente', width: 25 },
                { header: 'Fecha', key: 'fecha', width: 20 },
                { header: 'Producto', key: 'producto', width: 30 },
                { header: 'Cantidad', key: 'cantidad', width: 10 },
                { header: 'Precio Unit.', key: 'precio', width: 15 },
                { header: 'Total Venta ($)', key: 'total', width: 15 }
            ];

            // Agregamos las filas con los datos de la BD
            filas.forEach(f => {
                sheet.addRow({
                    id: f.venta_id,
                    cliente: f.usuario_cliente,
                    fecha: new Date(f.fecha).toLocaleDateString(),
                    producto: f.nombre_producto,
                    cantidad: f.cantidad,
                    precio: f.precio_unitario,
                    total: f.total_venta
                });
            });

            // Estilos básicos (Negrita en la cabecera)
            sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCC0000' } }; // Rojo Seven Burgers

            // Configuramos headers para descarga
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=ventas-completo.xlsx');

            // Escribimos el Excel en la respuesta
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('Error generando Excel:', error);
            res.status(500).send('Error generando Excel');
        }
    }
};

export default mainController;