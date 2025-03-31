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
                    ${product.discount ?
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
                    <option value="" disabled selected>Selecciona un método de envío</option>
                    <option value="gam">Dentro del GAM (+₡2,850)</option>
                    <option value="fuera">Fuera del GAM (+₡3,650)</option>
                </select>
                <p id="shipping-warning" class="text-red-500 text-sm mt-1 hidden">Debes seleccionar un método de envío.</p>



                <!-- Botón de añadir al carrito -->
                <button id="add-to-cart" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg w-full hover:bg-[#e65c00] transition-colors mt-6">
                    Añadir al carrito
                </button>

                <!-- Mensaje de éxito al agregar al carrito -->
                <div id="cart-message" class="hidden text-center text-white bg-green-600 p-4 rounded-lg mt-4">
                    Producto añadido al carrito
                </div>

                <!-- Botón de compra -->
                <button id="buy-btn" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg w-full hover:bg-[#e65c00] transition-colors mt-6">
                    Compra Unica
                </button>
            </div>
        </div>
    `;
        // Función para verificar que el usuario haya seleccionado un método de envío antes de continuar
        function validateShipping() {
            const shippingOption = document.getElementById("shipping").value;
            if (!shippingOption) {
                alert("Por favor, selecciona un método de envío antes de continuar.");
                return false;
            }
            return true;
        }

        // Modificar evento del botón "Añadir al carrito"
        document.getElementById("add-to-cart").addEventListener("click", () => {
            if (!validateShipping()) {
                return; // Detiene la ejecución si no se seleccionó un método de envío
            }

            const size = document.getElementById("size").value;

            // Lógica para agregar al carrito
            const basePrice = product.discount ? discountedPrice : originalPrice;
            const shippingOption = document.getElementById("shipping").value;
            const shippingPrice = shippingOption === "gam" ? 2850 : 3650;
            const totalPrice = basePrice + shippingPrice;

            const cartItem = {
                id: product.id,
                name: product.name,
                price: totalPrice,
                size: size,
                image: product.image
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(cartItem);
            localStorage.setItem("cart", JSON.stringify(cart));

            const cartMessage = document.getElementById("cart-message");
            cartMessage.classList.remove("hidden");

            setTimeout(() => {
                cartMessage.classList.add("hidden");
            }, 3000);

            updateCartCount();
        });

        document.getElementById("buy-btn").addEventListener("click", () => {
            if (!validateShipping()) {
                return; // Detiene la ejecución si no se seleccionó un método de envío
            }

            const whatsappNumber = "+50672996379";
            const productUrl = window.location.href;
            const shippingOption = document.getElementById("shipping").value;
            const selectSize = document.getElementById("size").value;
            const basePrice = product.discount ? discountedPrice : originalPrice;
            const shippingPrice = shippingOption === "gam" ? 2000 : 4000;
            const totalPrice = basePrice + shippingPrice;

            const shippingText = shippingOption === "gam" ? "Dentro del GAM (+₡2,000)" : "Fuera del GAM (+₡4,000)";
            const discountText = product.discount ? `Descuento: ${product.discount}` : "";

            const priceToShow = product.discount ? `₡${discountedPriceFormatted}` : `₡${originalPrice.toLocaleString()}`;
            const totalPriceFormatted = totalPrice.toLocaleString();

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

    const relatedProducts = products.filter(p => p.id !== currentProductId);
    const shuffledRelatedProducts = relatedProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

    shuffledRelatedProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("bg-white", "border", "rounded-lg", "p-6", "shadow-lg", "transition-transform", "duration-300", "hover:scale-105");

        const category = product.category || 'default';

        // Limitar la longitud de la descripción a 100 caracteres
        const truncatedDescription = product.description.length > 40 ? product.description.slice(0, 40) + '...' : product.description;

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg">
            <h4 class="font-semibold mt-4 text-gray-800">${product.name}</h4>
            <p class="text-sm text-gray-600 mt-2">${truncatedDescription}</p>
            <p class="text-lg text-green-600 font-bold mt-2">${product.price}</p>

            <!-- Contenedor para el botón -->
            <div class="mt-4">
                <a href="product.html?id=${product.id}&category=${category}"
                   class="product-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg block text-center hover:bg-[#e65c00] transition-colors">
                   Ver Producto
                </a>
            </div>
        `;

        relatedProductsContainer.appendChild(productCard);
    });
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.textContent = cart.length;
}