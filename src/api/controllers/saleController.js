import SaleModel from '../models/SaleModel.js';

const saleController = {
    // 1. CREAR UNA NUEVA VENTA
    // Esta función se ejecuta cuando el Kiosco hace POST a /api/ventas
    createSale: async (req, res) => {
        try {
            console.log("📥 Recibiendo pedido del Kiosco:", req.body);
            
            // Extraemos los datos que envía el frontend
            const { usuario, total, items } = req.body;

            // --- VALIDACIONES BÁSICAS ---
            // Verificamos que no falte nada importante antes de molestar a la base de datos
            if (!usuario || !items || items.length === 0) {
                return res.status(400).json({ 
                    error: "Datos incompletos. Se requiere usuario y al menos un producto." 
                });
            }

            // --- GUARDADO EN BASE DE DATOS ---
            // Llamamos al modelo que maneja la transacción SQL (Cabecera + Detalles)
            const ventaId = await SaleModel.create({ usuario, total, items });

            // --- RESPUESTA AL CLIENTE ---
            // Si todo salió bien, devolvemos un código 201 (Creado) y el ID de la venta
            res.status(201).json({
                message: 'Venta registrada con éxito',
                data: { ventaId }
            });

        } catch (error) {
            console.error("❌ Error al procesar la venta:", error);
            // Devolvemos un error 500 para que el frontend sepa que algo falló en el servidor
            res.status(500).json({ error: "Error interno del servidor al guardar el pedido." });
        }
    }
};

export default saleController;