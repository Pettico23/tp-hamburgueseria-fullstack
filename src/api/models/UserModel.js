import db from '../database/db.js';
import bcrypt from 'bcryptjs';

const UserModel = {
    // Buscar por email (para Login)
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

    // Crear usuario nuevo (con contraseña encriptada)
    create: async (data) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);
        
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [data.nombre, data.email, hash, 'admin']
        );
        return result.insertId;
    },

    // Comparar contraseñas (Login)
    verifyPassword: async (inputPassword, storedHash) => {
        return await bcrypt.compare(inputPassword, storedHash);
    }
};

export default UserModel;