let products = [];

let basket = JSON.parse(localStorage.getItem("product"));

function getProductDatas(idProduct) {
  response = fetch("http://localhost:3000/api/products/" + idProduct).then(
    (data) => {
      return data.json();
    }
  );
  return response;
}

getBasket = () => {
  if (basket == null || basket == 0) {
    document.querySelector("#cart_items").innerHTML = `
    <div class="cart__empty">
      <p> Votre agnier est vide</p>
    </div>`;
  } else {
    let itemsCart = [];

    for (let i = 0; i < basket.length; i++) {
      let item = basket[i];
      itemsCart =
        itemsCart +
        ` <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
      <div class="cart__item__img">
        <img src="${item.img}" alt="${item.Alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.color}</p>
          <p>${item.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
    }

    document.querySelector("#cart_items").innerHTML += itemsCart;
  }
};
getBasket();

// GET BASKET PRODUCT(S) TOTAL QUANTITY AND TOTAL PRICE

getTotalQty = async () => {
  const qty = document.querySelectorAll(".itemQuantity");
  let totalQty = 0;

  for (let i = 0; i < qty.length; i++) {
    let value = qty[i].value;
    totalQty += parseInt(value);
  }
  document.querySelector("#totalQuantity").innerText = totalQty;

  let totalPrice = 0;
  for (let i = 0; i < basket.length; i++) {
    let item = basket[i];

    productData = await getProductDatas(item.id);

    totalPrice += qty[i].value * productData.price;
  }
  document.querySelector("#totalPrice").innerHTML = totalPrice;
};
getTotalQty();

// MODIFY A PRODUCT QUANTITY, AND REMOVE FROM BASKET AND DISPLAY WHEN EQUAL TO ZERO

changeQty = () => {
  const inputQty = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < inputQty.length; i++) {
    inputQty[i].addEventListener("change", (e) => {
      e.preventDefault();

      let modifiedValue = inputQty[i].value;

      if (modifiedValue > 0 && modifiedValue <= 100) {
        basket[i].quantity = modifiedValue;

        localStorage.setItem("product", JSON.stringify(basket));
      } else if (modifiedValue > 100 || modifiedValue < 0) {
        alert("La quantité saisie est incorrecte");
      } else {
        if (confirm("Voulez-vous supprimer cet article du panier ?") == true) {
          let itemToRemoveId = basket[i].id;
          let itemToRemoveColor = basket[i].color;

          newBasket = basket.filter(
            (e) => e.id !== itemToRemoveId || e.color !== itemToRemoveColor
          );

          localStorage.setItem("product", JSON.stringify(newBasket));
        }
      }
      getTotalQty();
    });
  }
};
changeQty();

// REMOVE ITEM FROM BASKET
removeItem = () => {
  const removeBtn = document.querySelectorAll(".deleteItem");

  for (let i = 0; i < removeBtn.length; i++) {
    removeBtn[i].addEventListener("click", (e) => {
      e.preventDefault();

      if (confirm("Voulez-vous supprimer cet article du panier ? ") == true) {
        let itemToRemoveId = basket[i].id;
        let itemToRemoveColor = basket[i].color;

        newBasket = basket.filter(
          (e) => e.id !== itemToRemoveId || e.color !== itemToRemoveColor
        );

        localStorage.setItem("product", JSON.stringify(newBasket));

        window.location.reload();
      }
    });
  }
};

removeItem();

/******************************FORN CONTROL******************************* */

const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

const firstNameErr = firstName.nextElementSibling;
const lastNameErr = lastName.nextElementSibling;
const addressErr = address.nextElementSibling;
const cityErr = city.nextElementSibling;
const emailErr = email.nextElementSibling;

const cityNameRegExp = /^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/;
const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// CONTROL VALIDITY OF THE CUSTOMER'S DATAS FOR EACH INPUT
formControl = () => {
  testFormFields = (name, regExp, error) => {
    if (name.value.match(regExp)) {
      error.innerHTML = "";
    } else {
      error.innerHTML = "Le format de saisie est incorrect";
      return false;
    }
  };

  firstName.addEventListener("change", () => {
    testFormFields(firstName, cityNameRegExp, firstNameErr);
  });
  lastName.addEventListener("change", () => {
    testFormFields(lastName, cityNameRegExp, lastNameErr);
  });
  address.addEventListener("change", () => {
    testFormFields(address, addressErr);
  });
  city.addEventListener("change", () => {
    testFormFields(city, cityNameRegExp, cityErr);
  });
  email.addEventListener("change", () => {
    testFormFields(email, emailRegExp, emailErr);
  });
};

formControl();

// POST FORM DATAS AND BASKET

const postUrl = "http://localhost:3000/api/products/order";

const orderBtn = document.querySelector("#order");

orderBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    firstName.value == "" ||
    lastName.value == "" ||
    address.value == "" ||
    city.value == "" ||
    email.value == ""
  ) {
    alert("Veuillez remplir tous les champs du formulaire");
  } else if (
    firstNameErr.innerHTML !== "" ||
    lastNameErr.innerHTML !== "" ||
    addressErr.innerHTML !== "" ||
    cityErr.innerHTML !== "" ||
    emailErr.innerHTML !== ""
  ) {
    alert("Veuillez vérifier les erreurs dans le formulaire");
  } else if (basket === null || basket == 0) {
    alert("Votre panier est vide, veuillez choisir un article");
    window.location.href = "index.html";
  } else if (confirm("Confirmez-vous votre commande ? ") == true) {
    let basketItems = [];

    for (let i = 0; i < basket.length; i++) {
      basketItems.push(basket[i].id);
    }

    let order = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: basketItems,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    fetch(postUrl, options)
      .then((res) => res.json())
      .then((datas) => {
        console.log(datas);

        localStorage.clear();

        // SECURE ORDER ID, EXPORT TO URL
        window.location.href = `confirmation.html?orderId= ${datas.orderId}`;
      })
      .catch((error) => {
        alert(error);
      });
  } else {
    return false;
  }
});
