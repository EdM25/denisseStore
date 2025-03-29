// Función para obtener el carrito desde localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Función para guardar el carrito en localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
        cartCountElement.classList.remove("hidden"); // Muestra el contador si hay productos
    }
}

// Mostrar productos en el carrito
function renderCart() {
    const cart = getCart();
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let total = 0;

    cart.forEach((product, index) => {
        total += product.price; // Acumula el precio de cada producto

        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <div class="cart-item flex justify-between items-center border-b py-2">
                <img src="${product.image}" alt="${product.name}" width="50" class="rounded-md">
                <p class="text-sm flex-1 ml-2">${product.name} - ${product.size} - $${product.price}</p>
                <button onclick="removeFromCart(${index})" class="text-red-500 text-sm">Eliminar</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Mostrar el total del carrito
    const totalContainer = document.getElementById("cart-total");
    totalContainer.innerHTML = `Total: $${total}`;
}

// Eliminar producto del carrito
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// Eliminar el carrito del localStorage después de enviar el pedido
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount(); // Actualizar el contador después de vaciar el carrito
    renderCart(); // Volver a renderizar el carrito (vacío)
}

// Enviar pedido por WhatsApp
function sendOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const whatsappNumber = "+50672996379";
    let message = "Hola, quiero hacer un pedido:\n\n";

    let total = 0;

    cart.forEach(product => {
        message += `- ${product.name} (${product.size}) - $${product.price}\n`;
        total += product.price; // Sumar el precio del producto al total
    });

    message += `\nTotal: $${total}\n\n¿Está disponible?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Limpiar el carrito después de enviar el pedido
    clearCart(); 
}

// Evento para el botón de enviar pedido
document.getElementById("send-order").addEventListener("click", sendOrder);

// Renderizar carrito al cargar la página
document.addEventListener("DOMContentLoaded", renderCart);

// Mostrar el carrito cuando se haga clic en el icono
document.getElementById("cart-toggle").addEventListener("click", () => {
    const cartMenu = document.getElementById("cart-menu");
    cartMenu.classList.toggle("hidden");
    renderCart();
});

// Cerrar el carrito al hacer clic en el botón de cerrar
document.getElementById("close-cart").addEventListener("click", () => {
    const cartMenu = document.getElementById("cart-menu");
    cartMenu.classList.add("hidden");
});

// Minimizar el carrito
document.getElementById("minimize-cart").addEventListener("click", () => {
    const cartMenu = document.getElementById("cart-menu");
    cartMenu.classList.add("hidden");
});

// Actualizar el contador del carrito
document.addEventListener("DOMContentLoaded", updateCartCount);