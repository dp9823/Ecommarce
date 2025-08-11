document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json")
        .then((res) => res.json())
        .then((data) => {
            let card = "";
            data.forEach((items) => {
                card += ` <div class="col-md-3 col-sm-6 mb-4">
            <div class="card h-100 ">
              <div class="position-relative p-3">
                <div class="w-100">
                  <img src="/Pratical Assesment/assets/${items.img}" class="card-img-top img-fluid rounded" alt="product">
                </div>
                <div class="position-absolute top-0 end-0 m-2 d-flex gap-2 flex-column">
                  <button class="btn btn-sm btn-light rounded-circle" onclick="getid(${items.id})"><i class="bi bi-heart "></i></button>
                  <button class="btn btn-sm btn-light rounded-circle"><i class="bi bi-eye"></i></button>
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
            </div>
          </div> `;
            });
            document.getElementById("card_container").innerHTML = card;
        });
});

function getid(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
}


