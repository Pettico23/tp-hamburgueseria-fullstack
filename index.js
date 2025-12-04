import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';
import cors from 'cors';

// === IMPORTACIONES LOCALES (ES Modules) ===
import { paths } from './src/api/utils/paths.js';
import config from './src/api/config/config.js';

// IMPORTANTE: Aquí importamos el "Enrutador Maestro"
import mainRouter from './src/api/routes/indexRoutes.js';

// 1. CREACIÓN DE LA APP (¡Esto debe ir antes de usar app.use!)
const app = express();

// 2. CONFIGURACIÓN DE VISTAS (EJS)
app.set('view engine', 'ejs');
app.set('views', paths.views);

// 3. MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.static(paths.public)); // Archivos estáticos
app.use(express.urlencoded({ extended: false })); // Formularios
app.use(express.json()); // JSON API
app.use(methodOverride('_method')); // PUT y DELETE

// 4. SESIONES (LOGIN)
app.use(session({
    secret: config.app.secret,
    resave: false,
    saveUninitialized: false,
}));

// Middleware Global: Pasar el usuario a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 5. RUTAS (¡Ahora sí podemos usar app!)
app.use('/', mainRouter);

// 6. ARRANQUE DEL SERVIDOR
app.listen(config.app.port, () => {
    console.log(`--------------------------------------------------`);
    console.log(`🚀 SERVIDOR (ESM) CORRIENDO EN: http://localhost:${config.app.port}`);
    console.log(`--------------------------------------------------`);
});