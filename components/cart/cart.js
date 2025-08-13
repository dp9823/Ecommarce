document.addEventListener("DOMContentLoaded", () => {
    normalizeCartStorage();
    renderCartPage();

    document.getElementById("return-btn").addEventListener("click", () => {
        window.location.href = "../dashboard/dashboard.html";
    });

    document.getElementById("update-btn").addEventListener("click", () => {
        renderCartPage();
    });
});

function normalizeCartStorage() {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];
    const aggregated = new Map();
    raw.forEach((entry) => {
        if (typeof entry === "number" || typeof entry === "string") {
            const id = Number(entry);
            aggregated.set(id, (aggregated.get(id) || 0) + 1);
        } else if (entry && typeof entry === "object") {
            const id = Number(entry.id);
            const qty = Number(entry.qty || 1);
            aggregated.set(id, (aggregated.get(id) || 0) + qty);
        }
    });

    const normalized = Array.from(aggregated.entries()).map(([id, qty]) => ({ id, qty }));
    localStorage.setItem("cart", JSON.stringify(normalized));
}

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

async function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tbody = document.getElementById("cart-tbody");
    const products = await loadProductsMap();

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-5">Your cart is empty.</td></tr>`;
        updateTotals(0);
        return;
    }

    let subtotal = 0;
    const rows = cart.map(({ id, qty }) => {
        const product = products.get(Number(id));
        if (!product) return "";
        const price = Number(product.price) || 0;
        const line = price * qty;
        subtotal += line;
        return `
            <tr>
                <td>
                    <div class="position-relative d-inline-block">
                        <img src="/Pratical Assesment/assets/${product.img}" alt="${product.name}" class="img-fluid" style="width: 80px; height: 50px;" />
                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 start-0 translate-middle p-0" onclick="removeFromCart(${Number(id)})">
                            <i class="bi bi-x" style="font-size: 14px;"></i>
                        </button>
                    </div>
                    <span class="ms-2 align-middle">${product.name}</span>
                </td>
                <td>$${price}</td>
                <td>
                    <input type="number" class="form-control" value="${qty}" min="1" style="width: 70px;" onchange="updateQuantity(${Number(id)}, this.value)" />
                </td>
                <td>$${line}</td>
            </tr>
        `;
    }).join("");

    tbody.innerHTML = rows;
    updateTotals(subtotal);
}

function updateTotals(subtotal) {
    const subtotalText = document.getElementById("subtotal-text");
    const totalText = document.getElementById("total-text");
    subtotalText.textContent = `$${subtotal}`;
    totalText.textContent = `$${subtotal}`;
}

function updateQuantity(id, qty) {
    qty = Math.max(1, Number(qty) || 1);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.map((item) => item.id == id ? { ...item, qty } : item);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartPage();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => Number(item.id) !== Number(id));
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartPage();
}

window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;


