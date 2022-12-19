let params = new URL(window.location.href).searchParams;

let itemsColor = document.querySelector("#colors");
let itemsQty = document.querySelector("#quantity");
let addCart = document.getElementById("addToCart");
let Id = params.get("id");

// cannape avec id donnee

fetch("http://localhost:3000/api/products/" + Id)
  .then((res) => res.json())
  .then((data) => {
    displayData(data);
    addItemCart(data);
  })
  .catch((err) => {
    console.log("le serveur ne repond:", err);
  });

function displayData(data) {
  document.querySelector(
    ".item_img"
  ).innerHTML = `<img src='${data.imageUrl}' alt="${data.imageAlt}">`;
  document.querySelector("#title").innerHTML = `${data.name}`;
  document.querySelector("#price").innerHTML = `${data.price}`;
  document.getElementById("description").innerText = `${data.description}`;
  document.querySelector("#quantity").innerHTML = `${data.quantity}`;
  for (let i of data.colors) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;

    document.querySelector("#colors").appendChild(option);
  }
}

// console.log(addCart, itemsQty, itemsColor, "addCartsds");

function addItemCart(data) {
  addCart.addEventListener("click", (e) => {
    console.log("data");
    e.preventDefault();

    if (itemsQty.value <= 0 || itemsColor.value == "") {
      alert("entre une coleur et la quantite");
    } else {
      let qty = itemsQty.value;
      let colore = itemsColor.value;

      let Items = {
        id: Id,
        img: data.imageUrl,
        alt: data.imageAlt,
        name: data.name,
        price: data.price,
        description: data.description,
        quantity: Number(qty),
        color: colore,
      };

      let basket = JSON.parse(localStorage.getItem("product"));
      // add select products to basket

      addCart = () => {
        basket.push(Items);
        localStorage.setItem("product", JSON.stringify(basket));
      };

      // access to basket

      let confirm = () => {
        alert("le produit a ete bien ajouter");
      };

      let update = false;
      // verifier si le produit est deja dans le basket

      if (basket) {
        basket.forEach(function (productOk, key) {
          if (productOk.id == Id && productOk.color == colore) {
            basket[key].quantity = parseInt(productOk.quantity) + parseInt(qty);
            localStorage.setItem("product", JSON.stringify(basket));
            update = true;
            confirm();
          }
        });
      } else {
        basket = [];
        addCart();
        confirm();
      }
    }
  });
}
