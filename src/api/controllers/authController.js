import UserModel from '../models/UserModel.js';
//Este archivo maneja todo lo relacionado con el registro, inicio de sesión y cierre de sesión de usuarios. Utiliza el modelo UserModel que definimos antes para interactuar con la base de datos.
const authController = {
    // --- VISTAS ---
    // Muestra el formulario de login. Si hay error (ej: contraseña mal), se pasa para mostrarlo.
    loginView: (req, res) => {
        res.render('auth/login', { error: null });
    },

    // Muestra el formulario de registro.
    registerView: (req, res) => {
        res.render('auth/register', { error: null });
    },

    // --- ACCIONES ---
    
    // Procesa el inicio de sesión (POST /login)
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // 1. Buscamos al usuario por su email
            const user = await UserModel.findByEmail(email);

            // 2. Si el usuario existe Y la contraseña coincide (usando bcrypt)
            if (user && await UserModel.verifyPassword(password, user.password)) {
                // 3. ¡Éxito! Guardamos al usuario en la sesión del servidor
                req.session.user = user;
                
                // 4. Redirigimos al panel de control
                return res.redirect('/admin/dashboard');
            }
            
            // Si falló algo, volvemos al login con un mensaje de error
            res.render('auth/login', { error: 'Credenciales inválidas. Intenta de nuevo.' });

        } catch (error) {
            console.error('Error en login:', error);
            res.render('auth/login', { error: 'Ocurrió un error en el servidor.' });
        }
    },

    // Procesa el registro de un nuevo usuario (POST /register)
    register: async (req, res) => {
        try {
            // Intentamos crear el usuario con los datos del formulario
            await UserModel.create(req.body);
            
            // Si funciona, redirigimos al login para que entre
            res.redirect('/login');
        } catch (error) {
            // Si falla (ej: el email ya existe), mostramos el error en el formulario
            res.render('auth/register', { error: 'Error al registrar: ' + error.message });
        }
    },

    // Cierra la sesión del usuario (GET /logout)
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login'); // Una vez destruida la sesión, volvemos al login
        });
    }
};

export default authController;