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

            const cardsHTML = matchedItems.map(item => ` <div class="col-md-2 col-sm-6">
            <div class="card h-100 ">
              <div class="position-relative p-3">
                <div class="w-100">
                  <img src="/Pratical Assesment/assets/${item.img}" class="card-img-top img-fluid rounded" alt="product">
                </div>
              </div>
              <div class="card-body py-2">
                <h6 class="card-title">${item.name}</h6>
                <p class="mb-1 text-danger fw-bold">$${item.price}</p>
                <button class="btn btn-danger" onclick="removeFromWishlist(${item.id})">Remove</button>
              </div>
            </div>
          </div> `

            ).join("");
            container.innerHTML = `
                <div class="d-flex flex-wrap gap-4 mx-4 align-content-between">
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
