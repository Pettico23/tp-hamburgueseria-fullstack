const API_URL = '/api/products';

// FIX: Asignamos a window para garantizar acceso global y evitar ReferenceError
window.kiosco = {
    productos: [],
    carrito: [],

    // 1. INICIALIZACIÓN
    init: async () => {
        try {
            console.log("🔄 Cargando productos...");
            const res = await fetch(API_URL);
            
            if (!res.ok) throw new Error('Error en la respuesta del servidor');
            
            const json = await res.json();
            window.kiosco.productos = json.data;
            
            console.log("✅ Productos cargados:", window.kiosco.productos.length);

            window.kiosco.renderProductos('hamburguesas');
            window.kiosco.actualizarCarritoUI();
        } catch (e) {
            console.error("❌ Error fatal:", e);
            const grid = document.getElementById('products-grid');
            if(grid) {
                grid.innerHTML = `
                    <div class="col-span-1 md:col-span-3 text-center text-red-500 font-bold p-10 bg-white rounded-xl shadow border border-red-100">
                        <i class="fas fa-wifi text-4xl mb-4"></i>
                        <p class="text-xl">No se pudo conectar con el servidor.</p>
                        <p class="text-sm text-gray-400 mt-2">Verifica que "npm start" esté corriendo.</p>
                    </div>`;
            }
        }
    },

    // 2. FILTRAR POR CATEGORÍA
    filtrar: (cat) => {
        window.kiosco.renderProductos(cat);
    },

    // 3. DIBUJAR PRODUCTOS EN PANTALLA
    renderProductos: (cat) => {
        const grid = document.getElementById('products-grid');
        const title = document.getElementById('cat-title');
        
        if(title) title.innerHTML = cat === 'hamburguesas' ? '🍔 Hamburguesas' : '🥤 Bebidas';

        const filtrados = window.kiosco.productos.filter(p => p.categoria === cat);
        
        if(filtrados.length === 0) {
            grid.innerHTML = `
                <div class="col-span-1 md:col-span-3 text-center text-gray-400 mt-10">
                    <i class="fas fa-search text-6xl mb-4 opacity-20"></i>
                    <p class="text-xl">No hay productos disponibles en esta categoría.</p>
                </div>`;
            return;
        }

        grid.innerHTML = filtrados.map(p => `
            <div class="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center group cursor-pointer border-2 border-transparent hover:border-yellow-400 relative overflow-hidden" onclick="window.kiosco.agregar(${p.id})">
                
                <div class="absolute top-4 right-4 bg-gray-900 text-white font-black px-3 py-1 rounded-lg text-sm shadow-md z-10">
                    $${p.precio}
                </div>

                <div class="relative w-full h-48 mb-4 flex items-center justify-center">
                    <img src="${p.imagen}" class="w-40 h-40 object-contain transform group-hover:scale-110 group-hover:rotate-3 transition duration-500 drop-shadow-xl" 
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/1160/1160358.png'">
                </div>
                
                <h3 class="font-bold text-xl text-gray-800 mb-1 text-center leading-tight">${p.nombre}</h3>
                
                <button class="mt-4 bg-yellow-400 text-black font-bold py-3 px-8 rounded-full w-full hover:bg-yellow-500 transition transform active:scale-95 shadow-lg flex items-center justify-center gap-2">
                    <span>AGREGAR</span> <i class="fas fa-plus bg-white/20 p-1 rounded-full text-xs"></i>
                </button>
            </div>
        `).join('');
    },

    // 4. AGREGAR AL CARRITO
    agregar: (id) => {
        const prod = window.kiosco.productos.find(p => p.id === id);
        if (!prod) return;

        const existe = window.kiosco.carrito.find(item => item.id === id);
        
        if(existe) {
            existe.cantidad++;
        } else {
            window.kiosco.carrito.push({...prod, cantidad: 1});
        }
        
        window.kiosco.actualizarCarritoUI();
        window.kiosco.animarBotonCarrito();
    },

    // 5. ELIMINAR DEL CARRITO
    eliminar: (id) => {
        window.kiosco.carrito = window.kiosco.carrito.filter(item => item.id !== id);
        window.kiosco.actualizarCarritoUI();
    },

    // 6. CAMBIAR CANTIDAD
    cambiarCantidad: (id, delta) => {
        const item = window.kiosco.carrito.find(i => i.id === id);
        if(item) {
            item.cantidad += delta;
            if(item.cantidad <= 0) {
                window.kiosco.eliminar(id);
            } else {
                window.kiosco.actualizarCarritoUI();
            }
        }
    },

    // 7. MOSTRAR/OCULTAR CARRITO (Lógica de animación integrada)
    toggleCart: () => {
        const modal = document.getElementById('cart-modal');
        const panel = document.getElementById('cart-panel');
        
        if (!modal || !panel) return;

        if (modal.classList.contains('hidden')) {
            // Abrir
            modal.classList.remove('hidden');
            // Timeout pequeño para permitir que el navegador procese el cambio de display antes de animar
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
            }, 10);
        } else {
            // Cerrar
            panel.classList.add('translate-x-full');
            // Esperar a que termine la transición CSS (300ms) antes de ocultar
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    },

    // 8. ACTUALIZAR INTERFAZ DEL CARRITO
    actualizarCarritoUI: () => {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const countEl = document.getElementById('cart-count');
        
        let total = 0;
        let count = 0;

        if(window.kiosco.carrito.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-gray-300">
                    <i class="fas fa-hamburger text-6xl mb-4"></i>
                    <p class="text-lg font-medium">Tu bandeja está vacía</p>
                    <button onclick="window.kiosco.toggleCart()" class="mt-4 text-red-500 font-bold hover:underline">Volver al menú</button>
                </div>`;
            if(totalEl) totalEl.innerText = '$0';
            if(countEl) {
                countEl.innerText = '0';
                countEl.classList.add('hidden');
            }
            return;
        }

        container.innerHTML = window.kiosco.carrito.map(item => {
            total += item.precio * item.cantidad;
            count += item.cantidad;
            return `
                <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition mb-3">
                    <div class="flex items-center gap-4">
                        <img src="${item.imagen}" class="w-14 h-14 object-contain" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1160/1160358.png'">
                        <div>
                            <p class="font-bold text-gray-800 text-lg leading-none">${item.nombre}</p>
                            <p class="text-sm text-gray-500 font-medium mt-1">$${item.precio} c/u</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button onclick="window.kiosco.cambiarCantidad(${item.id}, -1)" class="w-8 h-8 rounded-md bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-500 transition font-bold text-lg">-</button>
                        <span class="font-bold w-4 text-center text-gray-800">${item.cantidad}</span>
                        <button onclick="window.kiosco.cambiarCantidad(${item.id}, 1)" class="w-8 h-8 rounded-md bg-white text-gray-600 shadow-sm hover:bg-green-50 hover:text-green-500 transition font-bold text-lg">+</button>
                    </div>
                </div>
            `;
        }).join('');

        if(totalEl) totalEl.innerText = `$${total}`;
        if(countEl) {
            countEl.innerText = count;
            countEl.classList.remove('hidden');
        }
    },

    // 9. ANIMACIÓN VISUAL BOTÓN CARRITO
    animarBotonCarrito: () => {
        const btnCart = document.querySelector('header button');
        if(btnCart) {
            btnCart.classList.add('scale-110', 'bg-green-400');
            setTimeout(() => btnCart.classList.remove('scale-110', 'bg-green-400'), 200);
        }
    },

    // 10. FINALIZAR COMPRA
    finalizarCompra: async () => {
        const nombreInput = document.getElementById('input-cliente');
        const nombre = nombreInput.value.trim();

        if(!nombre) {
            alert("👋 ¡Hola! Por favor escribe tu nombre para el pedido.");
            nombreInput.focus();
            nombreInput.classList.add('ring-2', 'ring-red-500');
            return;
        }

        if(window.kiosco.carrito.length === 0) return alert("❌ Tu bandeja está vacía.");
        
        const total = window.kiosco.carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
        
        const btn = document.querySelector('#cart-modal button.bg-green-500');
        let textoOriginal = "";
        if(btn) {
            textoOriginal = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
            btn.disabled = true;
        }

        try {
            // Simulamos envío al backend
            await new Promise(r => setTimeout(r, 1000)); 

            alert(`✅ ¡Pedido Confirmado!\n\nGracias ${nombre}, tu pedido se está cocinando.`);
            
            window.kiosco.carrito = [];
            window.kiosco.actualizarCarritoUI();
            window.kiosco.toggleCart();
            nombreInput.value = '';
            nombreInput.classList.remove('ring-2', 'ring-red-500');
                
        } catch (e) {
            console.error(e);
            alert("Error de conexión.");
        } finally {
            if(btn) {
                btn.innerHTML = textoOriginal;
                btn.disabled = false;
            }
        }
    }
};

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', window.kiosco.init);