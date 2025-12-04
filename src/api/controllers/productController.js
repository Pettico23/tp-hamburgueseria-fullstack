import ProductModel from '../models/ProductModel.js';
/*Este archivo es el "cerebro" que gestiona las hamburguesas.

Habla con el Modelo para pedir datos a la base de datos.

Decide qué mostrar: si devuelve JSON (para el Kiosco) o renderiza Vistas HTML (para el Admin).*/

const productController = {
    // =========================================================
    //  SECCIÓN API (Respuestas JSON para el Kiosco/Frontend)
    // =========================================================

    // GET /api/products
    // Obtiene todos los productos para mostrarlos en el kiosco
    apiList: async (req, res) => {
        try {
            const productos = await ProductModel.findAll();
            res.json({
                meta: { status: 200, count: productos.length },
                data: productos
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },

    // =========================================================
    //  SECCIÓN ADMIN (Respuestas HTML / Vistas EJS)
    // =========================================================

    // 1. DASHBOARD
    // GET /admin/dashboard
    // Muestra la tabla principal con todos los productos
    dashboard: async (req, res) => {
        try {
            const productos = await ProductModel.findAll();
            
            // Renderizamos la vista 'admin/dashboard.ejs'
            // Le pasamos los productos y el usuario logueado (para el saludo)
            res.render('admin/dashboard', { 
                productos: productos,
                user: req.session.user 
            });
        } catch (error) {
            res.status(500).send('Error cargando el panel de administración: ' + error.message);
        }
    },

    // 2. CREAR (FORMULARIO)
    // GET /admin/productos/crear
    // Muestra el formulario vacío para crear
    createView: (req, res) => {
        res.render('admin/form-crear');
    },

    // 3. CREAR (ACCIÓN)
    // POST /admin/productos
    // Recibe los datos del formulario y la imagen subida
    create: async (req, res) => {
        try {
            // req.file lo genera Multer si se subió una imagen
            // Si no hay imagen, asignamos una por defecto
            const imagenPath = req.file ? `/img/uploads/${req.file.filename}` : '/img/default.png';
            
            // req.body tiene { nombre, precio, categoria }
            await ProductModel.create(req.body, imagenPath);
            
            // Redirigimos al dashboard para ver el nuevo producto
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.send('Error al crear el producto: ' + error.message);
        }
    },

    // 4. EDITAR (FORMULARIO)
    // GET /admin/productos/:id/editar
    // Busca el producto y muestra el formulario con los datos cargados
    editView: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await ProductModel.findById(id);

            // Si el producto no existe, volvemos al dashboard
            if (!producto) {
                return res.redirect('/admin/dashboard');
            }

            res.render('admin/form-editar', { producto });
        } catch (error) {
            res.send('Error cargando el producto: ' + error.message);
        }
    },

    // 5. ACTUALIZAR (ACCIÓN)
    // PUT /admin/productos/:id
    // Actualiza los datos en la base de datos
    update: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Si se subió una nueva imagen, Multer nos da el archivo.
            // Si no, req.file es undefined (y el modelo mantendrá la vieja).
            const imagenPath = req.file ? `/img/uploads/${req.file.filename}` : null;

            await ProductModel.update(id, req.body, imagenPath);
            
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.send('Error al actualizar: ' + error.message);
        }
    },

    // 6. ELIMINAR (ACCIÓN)
    // DELETE /admin/productos/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await ProductModel.delete(id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.send('Error al eliminar: ' + error.message);
        }
    }
};

export default productController;