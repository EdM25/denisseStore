document.addEventListener("DOMContentLoaded", async () => {
    const categories = ["bookshop", "home", "make_up", "new_clothes", "personal_care", "shoes", "toys"];

    // Obtiene el nombre del HTML actual sin la extensión
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

    // Si la página no es una categoría válida, no hace nada
    if (!categories.includes(currentPage)) {
        console.error("Error: Page does not match any category.");
        return;
    }

    try {
        const response = await fetch(`../data/${currentPage}.json`);
        if (!response.ok) throw new Error(`Failed to fetch ${currentPage}.json (status: ${response.status})`);

        const products = await response.json();
        const productsList = document.getElementById("products-list");
        productsList.innerHTML = ""; // Limpia antes de agregar

        productsList.classList.add("grid", "grid-cols-2", "gap-4");

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add(
                "bg-white", "border", "border-gray-200", "rounded-xl", "shadow-lg",
                "p-5", "flex", "flex-col", "items-center", "hover:shadow-2xl",
                "transition-shadow", "transform", "hover:scale-105", "duration-300", "relative"
            );

            // Eliminar comas y convertir el precio a número
            const originalPrice = parseFloat(product.price.replace(/,/g, "")) || 0;

            // Extraer el número del descuento (por ejemplo, "10%" → 10)
            const discountPercentage = product.discount ? parseInt(product.discount.replace("%", "")) || 0 : 0;
            const hasDiscount = discountPercentage > 0;

            // Calcular el nuevo precio si hay descuento
            const discountedPrice = hasDiscount
                ? (originalPrice * (1 - discountPercentage / 100))
                : originalPrice;

            // Formatear el precio con coma para miles y punto para decimales
            const formatPrice = (price) => {
                return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            const formattedOriginalPrice = formatPrice(originalPrice);
            const formattedDiscountedPrice = formatPrice(discountedPrice);

            // Limitar la descripción a 80 caracteres
            const description = product.description.length > 30
                ? product.description.substring(0, 30) + "..."
                : product.description;

            // Crear la etiqueta de descuento si aplica
            const discountBadge = hasDiscount
                ? `<span class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-lg">
                -${product.discount} OFF
               </span>`
                : "";

            productCard.innerHTML = `
                ${discountBadge}
                <div class="w-full overflow-hidden rounded-xl">
                    <img src="${product.image}" alt="${product.name}" class="w-full sm:h-48 md:h-60 object-cover">
                </div>
                <h2 class="text-lg font-semibold mt-3 text-center text-gray-800">${product.name}</h2>
                <p class="text-sm text-gray-600 mt-2 text-center">${description}</p>
                <div class="mt-3 text-center">
                    ${hasDiscount
                        ? `<p class="text-gray-500 line-through text-sm">₡${formattedOriginalPrice}</p>
                           <p class="text-xl font-bold text-green-600">₡${formattedDiscountedPrice}</p>`
                        : `<p class="text-xl font-bold text-green-600">₡${formattedOriginalPrice}</p>`}
                </div>
                <a href="product.html?id=${product.id}&category=${currentPage}" 
                class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg mt-4 w-full text-center 
                hover:from-indigo-600 hover:to-purple-700 uppercase transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                    Ver Producto
                </a>
            `;

            // Asegurar que TODOS los productos se agreguen
            productsList.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error loading products:", error);
    }
});