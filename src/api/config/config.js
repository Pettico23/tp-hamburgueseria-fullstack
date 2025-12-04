import dotenv from 'dotenv';

// 1. Cargar las variables del archivo .env en process.env
// Esto busca un archivo llamado '.env' en la raíz del proyecto y carga sus valores.
dotenv.config();

// 2. Exportar un objeto ordenado con toda la configuración
// Usamos "export default" porque estamos trabajando con ES Modules ("type": "module" en package.json).
export default {
    app: {
        // Puerto del servidor. Si no está definido en el .env, usa 3000 por defecto.
        port: process.env.PORT || 3000,
        // Clave secreta para firmar las cookies de sesión (para el login).
        // Es importante tener un valor por defecto seguro o al menos funcional para desarrollo.
        secret: process.env.SESSION_SECRET || 'secreto_temporal_no_seguro'
    },
    db: {
        // Configuración de conexión a la base de datos MySQL.
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        // En XAMPP, la contraseña del usuario root suele ser vacía por defecto.
        pass: process.env.DB_PASS || '', 
        name: process.env.DB_NAME || 'db_tp_final'
    }
};