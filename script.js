const allProducts = [];

for (const category of storeData.categories) {

    for (const subcategory of category.subcategories) {

        for (const product of subcategory.products) {

            allProducts.push(product);

        }

    }

}

console.log("Total products:", allProducts.length);
console.log("All products:", allProducts);


function createProductCard(product) {

    return `
        <div class="product-card">
            <h2>${product.name}</h2>
            <p>Brand: ${product.brand}</p>
            <p>Price: ₹${product.price}</p>
            <p>Rating: ⭐ ${product.rating}</p>
        </div>
    `;
}

const container = document.getElementById("product-container");

for (const product of allProducts) {

    container.innerHTML += createProductCard(product);

}
