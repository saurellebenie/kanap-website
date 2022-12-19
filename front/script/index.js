fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    displayProduct(data);
  })
  .catch((err) => {
    alert("le serveur ne repond pas");
  });

function displayProduct(data) {
  for (product of data) {
    const items = document.querySelector("#items");

    items.innerHTML += `
     <a href="./product.html?id=${product._id}">
       <article>
         <img src="${product.imageUrl}" alt="${product.altTxt}">
         <h3 class="productName">${product.name}</h3>
         <p class="productDescription">${product.description}</p>
       </article>
     </a>
     `;
  }
}
