import mysql from 'mysql2';
// Importamos la configuración. ¡Recuerda siempre poner .js al final en ES Modules!
import config from '../config/config.js';

// 1. CREAR EL POOL DE CONEXIONES
// Un pool gestiona múltiples conexiones abiertas y las reutiliza,
// lo cual es mucho más rápido que abrir y cerrar una conexión por cada consulta.
const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. PROBAR LA CONEXIÓN AL INICIAR
// Esto no afecta al funcionamiento, pero te avisa en la consola si algo está mal.
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a la Base de Datos:', err.code);
        console.error('   -> Verifica que XAMPP (MySQL) esté encendido.');
        console.error('   -> Verifica que el nombre de la DB en .env sea correcto.');
    } else {
        console.log('✅ Base de Datos Conectada Exitosamente');
        // Liberamos la conexión para que vuelva al pool y esté disponible
        connection.release();
    }
});

// 3. EXPORTAR EL POOL CON PROMESAS
// Usamos .promise() para poder usar async/await en nuestros modelos
export default pool.promise();