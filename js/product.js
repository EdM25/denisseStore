document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    const category = params.get("category");

    if (!productId || !category) {
        document.getElementById("product-details").innerHTML = "<p class='text-red-500'>Error: Producto o categoría no especificados.</p>";
        return;
    }

    try {
        const response = await fetch(`../data/${category}.json`);
        if (!response.ok) throw new Error(`Failed to fetch ${category}.json (status: ${response.status})`);

        const products = await response.json();
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.getElementById("product-details").innerHTML = "<p class='text-red-500'>Producto no encontrado.</p>";
            return;
        }

        // Generar el select de tallas dinámicamente
        const sizeOptions = product.size.map(size => `<option value="${size}">${size}</option>`).join("");


        // Mostrar descuento y precios
        const discount = product.discount ? parseFloat(product.discount.replace('%', '')) / 100 : 0;
        const originalPrice = parseFloat(product.price.replace('₡', '').replace(',', ''));
        const discountedPrice = discount ? (originalPrice * (1 - discount)) : originalPrice;
        const discountedPriceFormatted = discountedPrice.toLocaleString();

        document.getElementById("product-details").innerHTML = `
        <div class="flex flex-col md:flex-row gap-12 px-6 py-12 max-w-screen-xl mx-auto">
            <!-- Imagen del producto -->
            <div class="relative flex justify-center items-center w-full md:w-1/2">
                <!-- Descuento en porcentaje encima de la imagen -->
                ${product.discount ? 
                    `<div class="absolute top-0 left-0 bg-red-500 text-white font-bold text-lg py-2 px-4 rounded-br-lg">${product.discount} OFF</div>` 
                    : ''}
                <img src="${product.image}" alt="${product.name}" class="w-full max-w-md rounded-lg shadow-lg object-contain">
            </div>

            <!-- Información del producto -->
            <div class="space-y-6 w-full md:w-1/2">
                <h1 class="text-4xl font-semibold text-gray-900">${product.name}</h1>
                <p class="text-lg text-gray-700">${product.description}</p>
                
                <!-- Precio con descuento si aplica -->
                <p class="text-3xl font-bold text-green-600">
                    ${
                        product.discount ? 
                        `<span class="line-through text-gray-500">₡${originalPrice.toLocaleString()}</span> ₡${discountedPriceFormatted}`
                        : `₡${originalPrice.toLocaleString()}`
                    }
                </p>

                <!-- Selector de talla -->
                <label for="size" class="block text-lg text-gray-700">Selecciona tu talla:</label>
                <select id="size" class="border p-3 rounded-lg w-full mt-2 bg-white shadow-sm">
                    ${sizeOptions}
                </select>

                <!-- Selector de envío -->
                <label for="shipping" class="block text-lg text-gray-700 mt-4">Opciones de envío:</label>
                <select id="shipping" class="border p-3 rounded-lg w-full mt-2 bg-white shadow-sm">
                    <option value="gam">Dentro del GAM (+₡2,000)</option>
                    <option value="fuera">Fuera del GAM (+₡4,000)</option>
                </select>

                <!-- Botón de compra -->
                <button id="buy-btn" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg w-full hover:bg-[#e65c00] transition-colors mt-6">
                    Comprar por WhatsApp
                </button>
            </div>
        </div>
    `;

    // Función para el botón de compra
    document.getElementById("buy-btn").addEventListener("click", () => {
        const whatsappNumber = "+50672996379";
        const productUrl = window.location.href;
        const shippingOption = document.getElementById("shipping").value;
        const selectSize = document.getElementById("size").value;
        const basePrice = product.discount ? discountedPrice : originalPrice; // Usar el precio con descuento si aplica
        const shippingPrice = shippingOption === "gam" ? 2000 : 4000;
        const totalPrice = basePrice + shippingPrice;

        // Mapeo de opciones de envío
        const shippingText = shippingOption === "gam" ? "Dentro del GAM (+₡2,000)" : "Fuera del GAM (+₡4,000)";
        const discountText = product.discount ? `Descuento: ${product.discount}` : "";

        // Corregido: Mostrar el precio con descuento o el precio original correctamente
        const priceToShow = product.discount ? `₡${discountedPriceFormatted}` : `₡${originalPrice.toLocaleString()}`;
        const totalPriceFormatted = totalPrice.toLocaleString(); // Formatear el total

        // Mensaje de WhatsApp con el precio correcto
        const message = `Hola, estoy interesado(a) en comprar: ${product.image}\n*${product.name}*.\n👕*Talla:* ${selectSize}\n💲*Precio:* ${priceToShow}\n📦*Envío:* ${shippingText}\n💲 *Precio Total:* ₡${totalPriceFormatted}\n${discountText ? `💲 *Descuento:* ${product.discount}` : ''}\n\n🔗 *Link:* ${productUrl}\n\n¿Está disponible?`;

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    });

    // Cargar productos relacionados de forma aleatoria
    loadRelatedProducts(products, productId);

    } catch (error) {
        console.error("Error loading product details:", error);
    }
});

// Función para mostrar productos relacionados de forma aleatoria
function loadRelatedProducts(products, currentProductId) {
    const relatedProductsContainer = document.getElementById("related-products");
    relatedProductsContainer.innerHTML = "";

    // Obtener productos relacionados aleatoriamente (excluyendo el producto actual)
    const relatedProducts = products.filter(p => p.id !== currentProductId);
    const shuffledRelatedProducts = relatedProducts.sort(() => 0.5 - Math.random()).slice(0, 4); // 4 productos aleatorios

    shuffledRelatedProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("bg-white", "border", "rounded-lg", "p-6", "shadow-lg", "transition-transform", "duration-300", "hover:scale-105");

        // Asegúrate de que 'category' esté definido. Si no, usa 'default'
        const category = product.category || 'default';  // Si no tiene categoría, se usa 'default'

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg">
            <h2 class="text-xl font-semibold mt-4 text-gray-800">${product.name}</h2>
            <p class="text-sm text-gray-600 mt-2">${product.description}</p>
            <p class="text-lg text-green-600 font-bold mt-2">${product.price}</p>
            <a href="product.html?id=${product.id}&category=${category}"
               class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg block text-center mt-4 hover:bg-[#e65c00] transition-colors">
               Ver Producto
            </a>
        `;

        relatedProductsContainer.appendChild(productCard);
    });
}