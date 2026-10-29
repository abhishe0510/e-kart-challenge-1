
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


// Step 3: Product search, category filtering and sorting
const productContainer = document.getElementById("product-container");
const sortSelect = document.getElementById("sort-products");
const categoryFilter = document.getElementById("category-filter");
const productSearch = document.getElementById("product-search");
const clearSearchButton = document.getElementById("clear-search");
const productCount = document.getElementById("product-count");

// Populate category dropdown
for (const category of storeData.categories) {
    const option = document.createElement("option");

    option.value = category.name;
    option.textContent = category.name;

    categoryFilter.appendChild(option);
}

// Display products
function displayAllProducts(products = allProducts) {
    productContainer.innerHTML = products
        .map(product => createProductCard(product))
        .join("");
}

// Search, filter and sort products together
function updateProducts() {
    let displayedProducts = [...allProducts];

    // Search by product name or brand
    const searchText = productSearch.value.trim().toLowerCase();

    if (searchText !== "") {
        displayedProducts = displayedProducts.filter(function (product) {
            return product.name.toLowerCase().includes(searchText) ||
                   product.brand.toLowerCase().includes(searchText);
        });
    }

    // Filter by category
    if (categoryFilter.value !== "all") {
        displayedProducts = displayedProducts.filter(function (product) {
            return product.category === categoryFilter.value;
        });
    }

    // Sort the matching products
    if (sortSelect.value === "price-low") {
        displayedProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "price-high") {
        displayedProducts.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "rating") {
        displayedProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortSelect.value === "name") {
        displayedProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    // Display results and count
    displayAllProducts(displayedProducts);

    productCount.textContent =
        displayedProducts.length + " product(s) found.";
}

// Update whenever search, category or sorting changes
productSearch.addEventListener("input", updateProducts);
categoryFilter.addEventListener("change", updateProducts);
sortSelect.addEventListener("change", updateProducts);

// Clear search without resetting category or sorting
clearSearchButton.addEventListener("click", function () {
    productSearch.value = "";
    updateProducts();
});

updateProducts();


// Step 4: Find the top 3 closest products
function findClosestProducts(targetPrice) {
    const productsWithDifference = [];

    for (const product of allProducts) {
        const difference = Math.abs(product.price - targetPrice);

        productsWithDifference.push({
            product: product,
            difference: difference
        });
    }

    productsWithDifference.sort((a, b) => a.difference - b.difference);

    return productsWithDifference.slice(0, 3);
}


// Step 5: Smart Price Finder
const priceInput = document.getElementById("target-price");
const searchButton = document.getElementById("search-button");
const priceMessage = document.getElementById("price-message");
const searchResult = document.getElementById("search-result");

searchButton.addEventListener("click", function () {
    const inputValue = priceInput.value.trim();

    if (inputValue === "") {
        priceMessage.textContent = "Please enter a target price.";
        searchResult.innerHTML = "";
        return;
    }

    const targetPrice = Number(inputValue);

    if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
        priceMessage.textContent = "Please enter a valid positive price.";
        searchResult.innerHTML = "";
        return;
    }

    priceMessage.textContent = "";

    const closestProducts = findClosestProducts(targetPrice);

    searchResult.innerHTML = closestProducts
        .map(item => createProductCard(item.product, targetPrice))
        .join("");
});


// Step 6: View Product button
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("view-product-button")) {
        const productId = event.target.dataset.productId;

        const selectedProduct = allProducts.find(function (product) {
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


// Step 7: Filter products by price range
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const filterButton = document.getElementById("filter-button");
const resetButton = document.getElementById("reset-button");
const filterMessage = document.getElementById("filter-message");
const filterResult = document.getElementById("filter-result");

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
        .map(product => createProductCard(product))
        .join("");
});

// Reset price range results
resetButton.addEventListener("click", function () {
    minPriceInput.value = "";
    maxPriceInput.value = "";
    filterMessage.textContent = "";
    filterResult.innerHTML = "";
});
