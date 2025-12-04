import db from '../database/db.js';

const SaleModel = {
    // 1. Crear una nueva venta (Usando Transacción)
    create: async (data) => {
        const { usuario, total, items } = data;
        
        // Obtenemos una conexión específica del pool para manejar la transacción
        const connection = await db.getConnection();

        try {
            // INICIO DE TRANSACCIÓN
            // A partir de aquí, nada se guarda definitivamente hasta el 'commit'
            await connection.beginTransaction();

            // PASO A: Guardar la cabecera de la venta (Tabla 'ventas')
            const [ventaResult] = await connection.query(
                'INSERT INTO ventas (usuario_cliente, total, fecha) VALUES (?, ?, NOW())',
                [usuario, total]
            );
            
            // Obtenemos el ID generado para esta venta (ej: Venta #105)
            const ventaId = ventaResult.insertId;

            // PASO B: Guardar los detalles (Tabla 'detalle_ventas')
            // Recorremos el carrito de compras e insertamos cada producto asociado a la ventaId
            for (const item of items) {
                await connection.query(
                    'INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, precio_unitario, cantidad) VALUES (?, ?, ?, ?, ?)',
                    [ventaId, item.id, item.nombre, item.precio, item.cantidad]
                );
            }

            // CONFIRMACIÓN (COMMIT)
            // Si llegamos aquí sin errores, guardamos todo permanentemente
            await connection.commit();
            
            return ventaId;

        } catch (error) {
            // ERROR (ROLLBACK)
            // Si algo falló, deshacemos todos los cambios de esta transacción
            await connection.rollback();
            throw error; // Lanzamos el error para que el controlador lo maneje
        } finally {
            // Liberamos la conexión para que vuelva al pool
            connection.release();
        }
    },

    // 2. Obtener historial de ventas (Opcional, para reportes)
    findAll: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM ventas ORDER BY fecha DESC');
            return rows;
        } catch (error) {
            throw error;
        }
    }
};
/*Este archivo es crucial porque maneja la lógica de las Ventas. Como una venta implica guardar datos en dos lugares (la cabecera de la venta y los productos detallados), utilizamos Transacciones SQL. Esto asegura que si falla el guardado de un producto, se cancele toda la venta para no dejar datos corruptos en la base de datos.*/   

export default SaleModel;