document.addEventListener("DOMContentLoaded", async () => {
    const productContainer = document.getElementById("product-list");

    // Lista de categorías
    const categories = [
        "new_clothes",
        "bookshop",
        "make_up",
        "toys",
        "personal_care",
        "shoes",
        "home"
    ];

    try {
        let allProductsHTML = "";

        for (const category of categories) {
            const response = await fetch(`data/${category}.json`);
            const products = await response.json();

            allProductsHTML += `
                <h2>${category.replace("_", " ").toUpperCase()}</h2>
                <div class="category-container">
                    ${products.map(product => `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <a href="product.html?id=${product.id}&category=${category}" class="view-more-btn">View More</a>
                        </div>
                    `).join("")}
                </div>
            `;
        }

        productContainer.innerHTML = allProductsHTML;
    } catch (error) {
        console.error("Error loading products:", error);
    }
});
