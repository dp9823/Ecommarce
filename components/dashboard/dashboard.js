document.addEventListener("DOMContentLoaded", function () {
    //fetch data from producct.json on dashboard
    fetch("data.json")
        .then((res) => res.json())
        .then((data) => {
            let card = "";
            data.forEach((items) => {
                card += `
    <div class="col-md-3 col-sm-6 mb-4">
        <div class="card h-100 border-0 shadow-sm position-relative"
             onmouseover="this.querySelectorAll('.hover-btns').forEach(btn => btn.classList.remove('d-none'))"
             onmouseout="this.querySelectorAll('.hover-btns').forEach(btn => btn.classList.add('d-none'))">

            <div class="position-relative p-3">
                <div class="w-100">
                    <img src="/Pratical Assesment/assets/${items.img}" class="card-img-top img-fluid rounded" alt="product">
                </div>

                <!-- Heart and Eye icons -->
                <div class="hover-btns d-none position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-light rounded-circle" onclick="getid(${items.id}, this)">
                        <i class="bi bi-heart"></i>
                    </button>
                    <button class="btn btn-sm btn-light rounded-circle">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </div>

            <div class="card-body py-2">
                <h6 class="card-title">${items.name}</h6>
                <p class="mb-1 text-danger fw-bold">$${items.price}</p>
                <div class="small text-muted">
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star"></i>
                    <i class="bi bi-star"></i>
                    <i class="bi bi-star"></i>
                    <span class="text-muted">(${items.rating})</span>
                </div>
            </div>
            <!-- Add to Cart button and above heart and eye icon shown on hover -->
                <div class="hover-btns d-none position-absolute end-0" style="bottom: 10px;">
                    <button class="btn btn-md btn-primary" onclick="addToCartWithFeedback(${items.id}, this)">Add to Cart</button>
                </div>
        </div>
    </div>`;
            });
            document.getElementById("card_container").innerHTML = card;
        });
});


//when click on heart icon the product id is added to localstorage and heart icon animate till 1 second
function getid(id, btn) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            const original = icon.className;
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
            setTimeout(() => {
                icon.className = original;
            }, 1000);
        }
    }
}


//add product into the card and increment or decrement the quantity
function addToCart(id) {
    id = Number(id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0 && typeof cart[0] !== 'object') {
        const aggregated = {};
        cart.forEach((cid) => {
            const nid = Number(cid);
            aggregated[nid] = (aggregated[nid] || 0) + 1;
        });
        cart = Object.entries(aggregated).map(([cid, qty]) => ({ id: Number(cid), qty }));
    }
    const existing = cart.find((i) => Number(i.id) === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}


//when click on add to cart it show the Added on the button for 1 second
function addToCartWithFeedback(id, btn) {
    addToCart(id);
    if (btn) {
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Added';
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = original;
        }, 1000);
    }
}
