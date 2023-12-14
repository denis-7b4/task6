// Вставляет текущий год в копирайт
document.getElementById('year').innerHTML = new Date().getFullYear();
//
// Берём массив объектов с данными карточек товаров из
// JSON файла (эмуляция получения данных с backend через REST API запрос)
let response = await fetch("/data/goods.json");
let goods = await response.json();
//
// Формирование одной карточки по данным из объекта
// In: product - объект с данными одной карточки
// Out: divCard - handler сформированной карточки в документе
function createCard (product) {

    let divCard = document.createElement("div");
    divCard.classList.add("card");

    let divTop = document.createElement("div");
    divTop.classList.add("card_top");
    let aImg = document.createElement("a");
    aImg.href = product.page;
    aImg.classList.add("card_image");
    let img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    img.title = product.title;
    aImg.appendChild(img);
    divTop.appendChild(aImg);
    divCard.appendChild(divTop);

    let divBottom = document.createElement("div");
    divBottom.classList.add("card_bottom");
    let divPrice = document.createElement("div");
    divPrice.textContent = product.price;
    divPrice.classList.add("card_price");
    divBottom.appendChild(divPrice);
    let aTitle = document.createElement("a");
    aTitle.classList.add("card_title");
    aTitle.href = product.page;
    aTitle.textContent = product.title;
    divBottom.appendChild(aTitle);
    let btnToCart = document.createElement("button");
    btnToCart.textContent = "В корзину";
    btnToCart.classList.add("card_add");
    divBottom.appendChild(btnToCart);
    divCard.appendChild(divBottom);

    return divCard;
}
// Заполнение поля карточек товаров
// In: goods - массив объектов с данными карточек
// Out: none
function deployCards (goods) {
    let cards = document.querySelector(".cards");
    for (let product of goods) {
        let divCard = createCard(product);
        cards.appendChild(divCard);
    }
}
// Заполняем поле карточками
deployCards(goods);
//
//
// Утилиты для корзины
function toNum(str) {
  const num = Number(str.replace(/ /g, ""));
  return num;
}
function toCurrency(num) {
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num);
  return format;
}
//
// Корзина
const cardAddArr = Array.from(document.querySelectorAll(".card_add"));
const cartNum = document.querySelector("#cart_num");
const cart = document.querySelector("#cart");
// Класс корзины
class Cart {
  products;
  constructor() {
    this.products = [];
  }
  get count() {
    return this.products.length;
  }
  addProduct(product) {
    this.products.push(product);
  }
  removeProduct(index) {
    this.products.splice(index, 1);
  }
  get cost() {
    const prices = this.products.map((product) => {
      return toNum(product.price);
    });
    const sum = prices.reduce((acc, num) => {
      return acc + num;
    }, 0);
    return sum;
  }
}
// Класс товара
class Product {
  imageSrc;
  name;
  price;
  constructor(card) {
    this.imageSrc = card.querySelector(".card_image").children[0].src;
    this.name = card.querySelector(".card_title").innerText;
    this.price = card.querySelector(".card_price").innerText;
  }
}
// Создаём экземпляр корзины
const myCart = new Cart();
// Сохраняем, если ещё ничего не сохранено
if (localStorage.getItem("cart") == null) {
  localStorage.setItem("cart", JSON.stringify(myCart));
}
// Читаем сохранённую корзину / обновляем счётчик значка
const savedCart = JSON.parse(localStorage.getItem("cart"));
myCart.products = savedCart.products;
cartNum.textContent = myCart.count;
// Опрос всех карточек и установка обработчика для каждой кнопки "В корзину"
myCart.products = cardAddArr.forEach((cardAdd) => {
  cardAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    const product = new Product(card);
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    myCart.addProduct(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    cartNum.textContent = myCart.count;
  });
});
//
// Всплывающее окно содержимого корзины для оформления покупки
const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup_close");
const body = document.body;
const popupContainer = document.querySelector("#popup_container");
const popupProductList = document.querySelector("#popup_product_list");
const popupCost = document.querySelector("#popup_cost");
const popupOrder = document.getElementById("popup_order");
// Обработчик кнопки корзины - открытие всплывающего окна
cart.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.add("popup_open");
  body.classList.add("lock");
  popupContainerFill();
});
// Заполнение окна содержимым корзины
function popupContainerFill() {
  popupProductList.innerHTML = null;
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  myCart.products = savedCart.products;
  const productsHTML = myCart.products.map((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("popup_product");

    const productWrap1 = document.createElement("div");
    productWrap1.classList.add("popup_product-wrap");
    const productWrap2 = document.createElement("div");
    productWrap2.classList.add("popup_product-wrap");

    const productImage = document.createElement("img");
    productImage.classList.add("popup_product-image");
    productImage.setAttribute("src", product.imageSrc);

    const productTitle = document.createElement("h2");
    productTitle.classList.add("popup_product-title");
    productTitle.innerHTML = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("popup_product-price");
    productPrice.innerHTML = toCurrency(toNum(product.price));

    const productDelete = document.createElement("button");
    productDelete.classList.add("popup_product-delete");
    productDelete.innerHTML = "&#10006;";

    productDelete.addEventListener("click", () => {
      myCart.removeProduct(product);
      localStorage.setItem("cart", JSON.stringify(myCart));
      popupContainerFill();
      cartNum.textContent = myCart.count;
    });

    productWrap1.appendChild(productImage);
    productWrap1.appendChild(productTitle);
    productWrap2.appendChild(productPrice);
    productWrap2.appendChild(productDelete);
    productItem.appendChild(productWrap1);
    productItem.appendChild(productWrap2);

    return productItem;
  });

  productsHTML.forEach((productHTML) => {
    popupProductList.appendChild(productHTML);
  });
// Пересчёт стоимости всех товаров в корзине
// Блокировка кнопки завершения покупки, если корзина пуста
  popupCost.value = toCurrency(myCart.cost);
  if (myCart.count != 0) {
    popupOrder.disabled = false;
  } else popupOrder.disabled = true;
}
//
// Обработчик закрытия всплывающего окна
popupClose.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("popup_open");
  body.classList.remove("lock");
});
// Обработчик кнопки завершения покупки
popupOrder.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Покупка совершена!");
  for (let i = myCart.count; i > 0; i--) {
    myCart.removeProduct(myCart.products[i]);
  }
  localStorage.setItem("cart", JSON.stringify(myCart));
  popupContainerFill();
  cartNum.textContent = myCart.count;
});