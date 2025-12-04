import db from '../database/db.js';

const SaleModel = {
    // 1. Crear una nueva venta (Usando Transacción)
    create: async (data) => {
        const { usuario, total, items } = data;
        
        // Obtenemos una conexión específica del pool para manejar la transacción de forma aislada
        const connection = await db.getConnection();

        try {
            // INICIO DE TRANSACCIÓN
            // A partir de aquí, nada se guarda definitivamente en la BD hasta el 'commit'
            await connection.beginTransaction();

            // PASO A: Guardar la cabecera de la venta (Tabla 'ventas')
            // Guardamos quién compró y cuánto gastó en total
            const [ventaResult] = await connection.query(
                'INSERT INTO ventas (usuario_cliente, total, fecha) VALUES (?, ?, NOW())',
                [usuario, total]
            );
            
            // Obtenemos el ID único generado para esta venta (ej: Ticket #105)
            const ventaId = ventaResult.insertId;

            // PASO B: Guardar los detalles (Tabla 'detalle_ventas')
            // Recorremos el carrito de compras e insertamos cada producto asociado a ese ID de venta
            for (const item of items) {
                await connection.query(
                    'INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, precio_unitario, cantidad) VALUES (?, ?, ?, ?, ?)',
                    [ventaId, item.id, item.nombre, item.precio, item.cantidad]
                );
            }

            // CONFIRMACIÓN (COMMIT)
            // Si llegamos hasta aquí sin errores, guardamos todo permanentemente
            await connection.commit();
            
            // Devolvemos el ID de la venta para mostrárselo al cliente
            return ventaId;

        } catch (error) {
            // ERROR (ROLLBACK)
            // Si algo falló en cualquier paso, deshacemos todos los cambios
            await connection.rollback();
            console.error("Error en transacción de venta:", error);
            throw error; // Lanzamos el error para que el controlador lo maneje
        } finally {
            // Liberamos la conexión para que vuelva al pool y pueda ser usada por otro usuario
            connection.release();
        }
    },

    // 2. Obtener historial de ventas (Para el reporte de Excel/PDF)
    findAll: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM ventas ORDER BY fecha DESC');
            return rows;
        } catch (error) {
            throw error;
        }
    }
};

export default SaleModel;