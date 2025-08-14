document.addEventListener("DOMContentLoaded", () => {
    loadOrderSummary();
});

// Function to load products map (same as cart.js)
async function loadProductsMap() {
    const sources = [
        "../dashboard/data.json",
        "../Wishlist/data.json",
    ];
    const results = await Promise.allSettled(sources.map((s) => fetch(s).then((r) => r.json())));
    const all = results
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => r.value);
    const map = new Map();
    all.forEach((p) => {
        const id = Number(p.id);
        if (!map.has(id)) map.set(id, p);
    });
    return map;
}

// Function to load and display order summary
async function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("orderItems");
    const products = await loadProductsMap();

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `<p class="text-center text-muted">Your cart is empty.</p>`;
        updateTotals(0);
        return;
    }

    let subtotal = 0;
    const orderItems = cart.map(({ id, qty }) => {
        const product = products.get(Number(id));
        if (!product) return "";
        const price = Number(product.price) || 0;
        const lineTotal = price * qty;
        subtotal += lineTotal;

        return `
        <div class="order-item d-flex align-items-center mb-3">
            <div class="order-item-icon me-3">
                <img src="/Pratical Assesment/assets/${product.img}" alt="${product.name}" 
             style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;">
            </div>
            <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
            <span class="fw-medium">${product.name}</span>
            <span class="fw-bold">$${lineTotal}</span>
        </div>
    </div>
</div>
        `;
    }).join("");

    orderItemsContainer.innerHTML = orderItems;
    updateTotals(subtotal);
}

// Update totals in the checkout
function updateTotals(subtotal) {
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;
}


// Place order function
function placeOrder() {
    const form = document.getElementById("checkoutForm");
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
        }
    });

    if (!isValid) {
        alert("Please fill in all required fields");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    const formData = {
        firstName: document.getElementById("firstName").value,
        companyName: document.getElementById("companyName").value,
        address: document.getElementById("address").value,
        apartment: document.getElementById("apartment").value,
        city: document.getElementById("city").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        paymentMethod: paymentMethod.value,
        orderDate: new Date().toISOString(),
        orderId: generateOrderId()
    };

    // Store order data in localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
        ...formData,
        items: cart,
        total: parseFloat(document.getElementById("total").textContent.replace("$", ""))
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    alert("Order placed successfully! Your order has been saved.");
}

// Generate a simple order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Make functions globally available
window.placeOrder = placeOrder;
