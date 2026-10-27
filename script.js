
const allProducts = [];

// Step 1: Extract all products from the nested dataset
for (const category of storeData.categories) {
    for (const subcategory of category.subcategories) {
        for (const product of subcategory.products) {
            allProducts.push(product);
        }
    }
}

console.log("Total products:", allProducts.length);


// Step 2: Create a reusable product card
function createProductCard(product, targetPrice = null) {
    const priceDifference = targetPrice === null
        ? null
        : Math.abs(product.price - targetPrice);

    return `
        <div class="product-card">
            <h2>${product.name}</h2>

            <p>Brand: ${product.brand}</p>

            <p>Price: ₹${product.price.toLocaleString("en-IN")}</p>

            <p>Rating: ⭐ ${product.rating}</p>

            <p>Reviews: ${product.reviews}</p>

            ${
                priceDifference !== null
                    ? `<p>Difference: ₹${priceDifference.toLocaleString("en-IN")}</p>`
                    : ""
            }

            <button
                class="view-product-button"
                data-product-id="${product.id}">
                View Product
            </button>
        </div>
    `;
}


// Step 3: Display all products initially
const productContainer = document.getElementById("product-container");


const sortSelect = document.getElementById("sort-products");

function displayAllProducts(products = allProducts) {
    productContainer.innerHTML = products
        .map(product => createProductCard(product))
        .join("");
}

sortSelect.addEventListener("change", function () {
    const sortedProducts = [...allProducts];

    if (sortSelect.value === "price-low") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "price-high") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "rating") {
        sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortSelect.value === "name") {
        sortedProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    displayAllProducts(sortedProducts);
});

displayAllProducts();



// Step 4: Find the top 3 closest products using linear search
function findClosestProducts(targetPrice) {
    const productsWithDifference = [];

    for (const product of allProducts) {
        const difference = Math.abs(product.price - targetPrice);

        productsWithDifference.push({
            product: product,
            difference: difference
        });
    }

    // Sort products by their price difference
    productsWithDifference.sort((a, b) => {
        return a.difference - b.difference;
    });

    // Return at most 3 closest products
    return productsWithDifference.slice(0, 3);
}


// Step 5: Connect the Price Finder UI
const priceInput = document.getElementById("target-price");
const searchButton = document.getElementById("search-button");
const priceMessage = document.getElementById("price-message");
const searchResult = document.getElementById("search-result");

searchButton.addEventListener("click", function () {
    const inputValue = priceInput.value.trim();

    // Validate empty input
    if (inputValue === "") {
        priceMessage.textContent = "Please enter a target price.";
        searchResult.innerHTML = "";
        return;
    }

    const targetPrice = Number(inputValue);

    // Validate invalid or non-positive prices
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
        priceMessage.textContent =
            "Please enter a valid positive price.";
        searchResult.innerHTML = "";
        return;
    }

    // Clear previous validation message
    priceMessage.textContent = "";

    // Find the closest products
    const closestProducts = findClosestProducts(targetPrice);

    // Display the results
    searchResult.innerHTML = closestProducts
        .map(item => createProductCard(item.product, targetPrice))
        .join("");

    console.log("Target price:", targetPrice);
    console.log("Closest products:", closestProducts);
});


// Step 6: Handle View Product button clicks
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("view-product-button")) {
        const productId = event.target.dataset.productId;

        const selectedProduct = allProducts.find(product => {
            return product.id === productId;
        });

        if (selectedProduct) {
            alert(
                selectedProduct.name +
                "\nBrand: " + selectedProduct.brand +
                "\nPrice: ₹" +
                selectedProduct.price.toLocaleString("en-IN") +
                "\nRating: " + selectedProduct.rating +
                "\nStock: " + selectedProduct.stock
            );
        }
    }
});



const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const filterButton = document.getElementById("filter-button");
const resetButton = document.getElementById("reset-button");
const filterMessage = document.getElementById("filter-message");
const filterResult = document.getElementById("filter-result");

// Filter products by price range
filterButton.addEventListener("click", function () {
    const minValue = minPriceInput.value.trim();
    const maxValue = maxPriceInput.value.trim();

    if (minValue === "" || maxValue === "") {
        filterMessage.textContent = "Please enter both prices.";
        filterResult.innerHTML = "";
        return;
    }

    const minPrice = Number(minValue);
    const maxPrice = Number(maxValue);

    if (
        !Number.isFinite(minPrice) ||
        !Number.isFinite(maxPrice) ||
        minPrice < 0 ||
        maxPrice < 0 ||
        minPrice > maxPrice
    ) {
        filterMessage.textContent = "Please enter a valid price range.";
        filterResult.innerHTML = "";
        return;
    }

    const filteredProducts = allProducts.filter(function (product) {
        return product.price >= minPrice &&
               product.price <= maxPrice;
    });

    if (filteredProducts.length === 0) {
        filterMessage.textContent =
            "No products found in this price range.";
        filterResult.innerHTML = "";
        return;
    }

    filterMessage.textContent =
        filteredProducts.length + " products found.";

    filterResult.innerHTML = filteredProducts
        .map(function (product) {
            return createProductCard(product);
        })
        .join("");
});

// Reset the price filter
resetButton.addEventListener("click", function () {
    minPriceInput.value = "";
    maxPriceInput.value = "";
    filterMessage.textContent = "";
    filterResult.innerHTML = "";
});
