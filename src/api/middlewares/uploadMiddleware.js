import multer from 'multer';
import path from 'path';
// Importamos nuestras rutas absolutas para no usar "../../../" a ciegas
import { paths } from '../utils/paths.js';

// Configuración del almacenamiento
const storage = multer.diskStorage({
    // 1. DESTINO: ¿Dónde guardar el archivo?
    destination: (req, file, cb) => {
        // Usamos la ruta absoluta 'uploads' que definimos en paths.js
        // Esto asegura que la carpeta se encuentre siempre.
        cb(null, paths.uploads);
    },

    // 2. NOMBRE: ¿Cómo se llamará el archivo?
    filename: (req, file, cb) => {
        // Generamos un sufijo único (Fecha + Número Random)
        // Ejemplo: 170982342-892348234
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Construimos el nombre final: campo-unico.extension
        // Ejemplo: imagen-170982342-892348234.jpg
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Inicializamos Multer con esta configuración
const upload = multer({ storage: storage });

// Exportamos el middleware listo para usar en las rutas
export default upload;