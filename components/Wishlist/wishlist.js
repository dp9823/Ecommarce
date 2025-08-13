document.addEventListener("DOMContentLoaded", function () {
  const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistGrid = document.getElementById("wishlist-grid");
  const recommendGrid = document.getElementById("recommend-grid");
  const wishlistCountEl = document.getElementById("wishlist-count");
  const moveAllBtn = document.getElementById("move-all-btn");

  wishlistCountEl.textContent = wishlistIds.length;

  fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const wishlistItems = data.filter(item => wishlistIds.includes(item.id));

    if (wishlistItems.length === 0) {
      wishlistGrid.innerHTML = `
        <div class="col-12 text-center text-muted py-5">
          <h5>No items in your wishlist</h5>
        </div>
      `;
    } else {
      renderCards(wishlistGrid, wishlistItems, { showRemove: true });
    }

    const nonWishlistItems = data.filter(item => !wishlistIds.includes(item.id));
    const shuffled = nonWishlistItems.sort(() => 0.5 - Math.random());
    const recommendationItems = shuffled.slice(0, 4);

    renderCards(recommendGrid, recommendationItems, { showRemove: false });
  });



  moveAllBtn.addEventListener("click", function () {
    if (wishlistIds.length === 0) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0 && typeof cart[0] !== 'object') {
      const aggregated = {};
      cart.forEach((cid) => {
        const nid = Number(cid);
        aggregated[nid] = (aggregated[nid] || 0) + 1;
      });
      cart = Object.entries(aggregated).map(([cid, qty]) => ({ id: Number(cid), qty }));
    }
    wishlistIds.forEach((wid) => {
      const id = Number(wid);
      const existing = cart.find((i) => Number(i.id) === id);
      if (existing) existing.qty += 1; else cart.push({ id, qty: 1 });
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify([]));
    location.reload();
  });
});

function renderCards(targetGrid, items, options) {
  const { showRemove } = options;

  const cardsHTML = items.map(item => `
    <div class="col">
      <div class="card h-100">
        <div class="position-relative p-3">
          ${showRemove ? `
            <button class="btn btn-sm btn-light position-absolute top-0 end-0 m-2" onclick="removeFromWishlist(${item.id})">
              <i class="bi bi-x"></i>
            </button>
          ` : ''}
          <img src="/Pratical Assesment/assets/${item.img}" class="card-img-top img-fluid rounded" alt="product">
        </div>
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${item.name}</h6>
          <p class="mb-1 text-danger fw-bold">$${item.price}</p>
          <div class="mt-auto d-grid gap-2">
            <button class="btn btn-dark" onclick="addToCartWithFeedback(${item.id}, this)">Add To Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  targetGrid.innerHTML = cardsHTML;
}


function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter(item => item !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  location.reload();
}

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



