import path from 'path';
import { fileURLToPath } from 'url';

// -------------------------------------------------------------------
// 1. RECREAMOS LAS VARIABLES QUE FALTAN EN ES MODULES
// -------------------------------------------------------------------
// En la sintaxis moderna "type": "module", __dirname no existe.
// Usamos import.meta.url para calcular dónde está este archivo actual.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------------
// 2. CALCULAMOS LA RAÍZ DEL PROYECTO
// -------------------------------------------------------------------
// Este archivo está en: /tu-proyecto/src/api/utils
// Para llegar a la raíz (/tu-proyecto), tenemos que subir 3 niveles:
// ../ (src/api) -> ../ (src) -> ../ (Raíz)

const rootDir = path.resolve(__dirname, '../../../');

// -------------------------------------------------------------------
// 3. EXPORTAMOS LAS RUTAS ABSOLUTAS
// -------------------------------------------------------------------
// Exportamos un objeto con todas las rutas importantes listas para usar.
// Así evitas escribir "../../../" en tus otros archivos.

export const paths = {
    root: rootDir,
    public: path.join(rootDir, 'src', 'public'),
    views: path.join(rootDir, 'src', 'views'),
    uploads: path.join(rootDir, 'src', 'public', 'img', 'uploads')
};