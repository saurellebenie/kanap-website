// DISPLAY ORDER ID

displayIdOrder = () => {
  const params = new URLSearchParams(window.location.search);

  const orderiId = params.get("orderId");
  if (orderiId === null || orderiId === "") {
    alert("Une erreur s'est produite lors de la va lidation de votre commande");
    window.location.href = "index.html";
  } else {
    let displayId = document.querySelector("#orderId");
    displayId.innerText = orderiId;
  }
};

displayIdOrder();
