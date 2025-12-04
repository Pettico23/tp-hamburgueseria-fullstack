import db from '../database/db.js';

const ProductModel = {
    // 1. Obtener TODOS los productos (Para el Admin y el API)
    findAll: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM productos');
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // 2. Obtener un producto por ID (Para editar)
    findById: async (id) => {
        try {
            const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
            return rows[0]; // Retorna el primer resultado encontrado
        } catch (error) {
            throw error;
        }
    },

    // 3. Crear un nuevo producto
    create: async (data, imagenPath) => {
        try {
            const { nombre, categoria, precio } = data;
            // Por defecto, creamos el producto como activo (1)
            const [result] = await db.query(
                'INSERT INTO productos (nombre, categoria, precio, imagen, activo) VALUES (?, ?, ?, ?, 1)',
                [nombre, categoria, precio, imagenPath]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // 4. Actualizar un producto existente
    update: async (id, data, imagenPath) => {
        try {
            const { nombre, categoria, precio } = data;
            
            let query = 'UPDATE productos SET nombre=?, categoria=?, precio=? WHERE id=?';
            let params = [nombre, categoria, precio, id];

            // Si el usuario subió una imagen nueva (imagenPath existe), actualizamos también la foto.
            // Si no (es null), mantenemos la foto vieja y no tocamos ese campo en la BD.
            if (imagenPath) {
                query = 'UPDATE productos SET nombre=?, categoria=?, precio=?, imagen=? WHERE id=?';
                params = [nombre, categoria, precio, imagenPath, id];
            }
            
            const [result] = await db.query(query, params);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    },

    // 5. Eliminar un producto (Físicamente)
    delete: async (id) => {
        try {
            const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
};

export default ProductModel;