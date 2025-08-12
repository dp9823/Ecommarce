document.addEventListener("DOMContentLoaded", function () {
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
    const container = document.getElementById("container");

    if (wishlistIds.length === 0) {
        container.innerHTML = "<h3 class='text-center mt-5'>Your wishlist is empty.</h3>";
        return;
    }

    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            const matchedItems = data.filter(item => wishlistIds.includes(item.id));

            const cardsHTML = matchedItems.map(item => `
  <div class="col">
    <div class="card h-100">
      <div class="position-relative p-3">
        <img src="/Pratical Assesment/assets/${item.img}" class="card-img-top img-fluid rounded" alt="product">
      </div>
      <div class="card-body d-flex flex-column">
        <h6 class="card-title">${item.name}</h6>
        <p class="mb-1 text-danger fw-bold">$${item.price}</p>
        <div class="mt-auto d-grid gap-2">
          <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
          <button class="btn btn-danger" onclick="removeFromWishlist(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  </div>
`).join("");

            container.innerHTML = `
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4 px-4">
    ${cardsHTML}
  </div>
`;

        });
});

function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => item !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    location.reload();
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}