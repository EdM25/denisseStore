document.addEventListener("DOMContentLoaded", async () => {
    const ofertasContainer = document.getElementById("ofertas-container");

    try {
        const response = await fetch("./data/discounts.json");
        if (!response.ok) throw new Error(`Error al cargar JSON (status: ${response.status})`);
        
        const productos = await response.json();
        if (productos.length === 0) {
            ofertasContainer.innerHTML = "<p class='text-center text-gray-500'>No hay ofertas disponibles.</p>";
            return;
        }

        let html = `
            <h2 class="text-2xl font-bold mb-6 text-center">🔥 Ofertas Especiales 🔥</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        `;

        productos.forEach(producto => {
            const precioFinal = producto.price - (producto.price * producto.discount / 100);
            html += `
                <div class="bg-white shadow-lg rounded-lg p-4 relative">
                    <span class="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
                        Descuento ${producto.discount}%
                    </span>
                    <img src="${producto.image}" alt="${producto.name}" class="w-full h-48 object-cover rounded">
                    <h3 class="text-lg font-bold mt-2">${producto.name}</h3>
                    <p class="text-gray-500 line-through">₡${producto.price.toLocaleString()}</p>
                    <p class="text-red-500 text-xl font-bold">₡${precioFinal.toLocaleString()}</p>
                    <a href="producto.html?id=${producto.id}&category=ofertas" class="block text-center bg-green-500 text-white py-2 mt-3 rounded hover:bg-green-600">
                        Comprar
                    </a>
                </div>
            `;
        });

        html += "</div>";
        ofertasContainer.innerHTML = html;

    } catch (error) {
        console.error("Error cargando productos en oferta:", error);
        ofertasContainer.innerHTML = "<p class='text-center text-red-500'>Error al cargar las ofertas.</p>";
    }
});
