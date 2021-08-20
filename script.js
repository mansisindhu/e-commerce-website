/*

Pages - products, cart, checkout, add-products
Routes - '/', '/cart', '/checkout', '/add-products'

*/
// const dummyProducts = [
//     {
//         name: "Apple",
//         price: 20,
//         image: "https://via.placeholder.com/150",
//         id: 1
//     },
//     {
//         name: "Orange",
//         price: 10,
//         image: "https://via.placeholder.com/150",
//         id: 2
//     },
//     {
//         name: "Banana",
//         price: 30,
//         image: "https://via.placeholder.com/150",
//         id: 3
//     }
// ];


const routes = {
    products: {
        render: renderProducts,
        path: "/"
    },
    cart: {
        render: renderCart,
        path: "/cart"
    },
    checkout: {
        render: renderCheckout,
        path: "/checkout"
    },
    addProducts: {
        render: renderAddProducts,
        path: "/add-products"
    }
}

const appData = {
    "local-store-products": [],
    'local-store-cart': [],
};

window.onpopstate = function (popEvent) {
    if (popEvent.state === null) {
        routes.products.render()
    } else {
        routes[popEvent.state.page].render();
    }
}

function getFromLocalStorage(key) {
    const data = window.localStorage.getItem(key);
    return JSON.parse(data);
}

function setToLocalStorage(key, value) {
    appData[key] = value;

    const data = JSON.stringify(value);
    window.localStorage.setItem(key, data);
}

function getMainElement() {
    return document.querySelector(".main");
}

function getCartContainerElement() {
    return document.querySelector(".cart-products");
}


function pushRoute(routeName, data = {}) {
    window.history.pushState({ page: routeName, data }, "", routes[routeName].path);
    routes[routeName].render();
}

function addToCart(id) {
    return function () {
        if (appData['local-store-cart'].indexOf(id) > -1) {
            alert("Aleady added");
        } else {
            appData['local-store-cart'].push(id);
            setToLocalStorage('local-store-cart', appData["local-store-cart"]);
            const cartButtonElememt = document.querySelector(".cart-btn");
            cartButtonElememt.textContent = `CART (${appData["local-store-cart"].length})`
            alert("Added to cart")
        }
    }
}

function getProductsContainerElement() {
    return document.querySelector(".products");
}

function renderSingleProduct(product) {
    const mainElement = getMainElement();

    const productsContainer = getProductsContainerElement();

    const productDivElement = document.createElement("div");
    productDivElement.setAttribute("class", "product");

    const img = document.createElement("img");
    const prodName = document.createElement("p");
    prodName.setAttribute("class", "name");

    const prodPrice = document.createElement("p");
    prodPrice.setAttribute("class", "price");

    prodName.textContent = product.name;

    prodPrice.textContent = `Rs ${product.price}`;

    img.setAttribute("src", product.image);

    productDivElement.appendChild(img);
    productDivElement.appendChild(prodName);
    productDivElement.appendChild(prodPrice);

    const productBtn = document.createElement("button");
    productBtn.setAttribute("class", "product-btn");
    productBtn.textContent = "Add to cart";

    productDivElement.appendChild(productBtn);

    productBtn.addEventListener("click", addToCart(product.id));

    productsContainer.appendChild(productDivElement);

    mainElement.appendChild(productsContainer);
}

function renderProducts() {
    const mainElement = getMainElement();
    mainElement.innerHTML = '';

    const productsContainerDiv = document.createElement("div");
    productsContainerDiv.setAttribute("class", "products");

    const productsHeadingElement = document.createElement("h2");
    productsHeadingElement.textContent = "AVAILABLE PRODUCTS";
    productsHeadingElement.classList = "main-heading";

    mainElement.appendChild(productsHeadingElement);

    mainElement.appendChild(productsContainerDiv);

    // console.log(appData["local-store-products"]);
    appData["local-store-products"].forEach(function (p) {
        renderSingleProduct(p)
    })
}

//Add products to cart (UI)
function renderSingleCartProduct(product) {
    const container = getCartContainerElement();

    const productDivElement = document.createElement("div");
    productDivElement.setAttribute("class", "cart-product");

    const img = document.createElement("img");

    const info_div = document.createElement("div");
    info_div.setAttribute("class", "cart-info");

    const prodName = document.createElement("p");
    prodName.setAttribute("class", "cart-name");
    info_div.appendChild(prodName);

    const prodPrice = document.createElement("p");
    prodPrice.setAttribute("class", "cart-price");
    info_div.appendChild(prodPrice);


    prodName.textContent = product.name;

    prodPrice.textContent = `Rs ${product.price}`;

    img.setAttribute("src", product.image);

    productDivElement.appendChild(img);
    productDivElement.appendChild(info_div);

    container.appendChild(productDivElement);
}

function renderCart() {
    const mainElement = getMainElement();
    mainElement.innerHTML = '';

    const productsInCart = appData["local-store-cart"].map(function (id) {
        const product = appData["local-store-products"].filter(function (el) {
            if (el.id === id) {
                return el;
            }
        })
        return product[0]
    });

    const totalPrice = productsInCart.reduce(function (acc, curr) {
        return acc + curr.price;
    }, 0);

    const productDivElement = document.createElement("div");
    productDivElement.setAttribute("class", "cart-products");

    const headingElement = document.createElement("p");
    headingElement.textContent = `Total Price - ${totalPrice}`;

    productDivElement.appendChild(headingElement);

    const checkoutBtnElement = document.createElement("button");
    checkoutBtnElement.setAttribute("class", "submit-cart-btn")
    checkoutBtnElement.type = "submit";
    checkoutBtnElement.textContent = "Proceed to payment";


    checkoutBtnElement.addEventListener("click", function () {
        if (totalPrice === 0) {
            alert("Add Something to cart")
        } else {
            pushRoute("checkout", { totalPrice });
        }
    });

    productDivElement.appendChild(checkoutBtnElement);

    mainElement.appendChild(productDivElement);

    productsInCart.forEach(function (product) {
        renderSingleCartProduct(product);
    });
}

function renderCheckout() {
    const mainElement = getMainElement();
    mainElement.innerHTML = "";

    const checkoutSectionDivElement = document.createElement("div");
    checkoutSectionDivElement.setAttribute("class", "checkout-section");

    const priceElement = document.createElement("p");
    priceElement.textContent = `TOTAL COST - Rs ${window.history.state.data.totalPrice}`;

    checkoutSectionDivElement.appendChild(priceElement);

    const couponDivElement = document.createElement("div");
    couponDivElement.setAttribute("class", "coupon");

    const couponInputElement = document.createElement("input");
    couponInputElement.setAttribute("type", "text");
    couponInputElement.setAttribute("placeholder", "Enter Coupon Code");

    const couponBtnElement = document.createElement("button");
    couponBtnElement.setAttribute("class", "coupon-btn");
    couponBtnElement.setAttribute("type", "submit");
    couponBtnElement.textContent = "Apply code";

    couponBtnElement.addEventListener("click", function() {
        let inputBoxElement = document.querySelector("input");

        if (inputBoxElement.value === "" || inputBoxElement.value !== "masai30") {

            inputBoxElement.value = "";
            alert("Please enter a Valid Code")

        } else {
            inputBoxElement.value = "";

            priceElement.textContent = `Total cost after discount - Rs ${Math.ceil(window.history.state.data.totalPrice * 0.7)}`;
            priceElement.style.color = "teal";

            alert(`You saved Rs ${window.history.state.data.totalPrice - Math.ceil(window.history.state.data.totalPrice * 0.7)} `);
            
        }
    })


    couponDivElement.appendChild(couponInputElement);
    couponDivElement.appendChild(couponBtnElement);

    checkoutSectionDivElement.appendChild(couponDivElement);

    const checkoutBtnElement = document.createElement("button");
    checkoutBtnElement.setAttribute("class", "checkout-btn");
    checkoutBtnElement.setAttribute("type", "submit");
    checkoutBtnElement.textContent = "Proceed to payment";

    checkoutBtnElement.addEventListener("click", function() {
        mainElement.innerHTML = "";
        const afterCheckoutDiv = document.createElement("div");
        afterCheckoutDiv.setAttribute("class", "after-checkout");

        const checkoutImage = document.createElement("img");
        checkoutImage.src = "https://images.pexels.com/photos/2072165/pexels-photo-2072165.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

        afterCheckoutDiv.appendChild(checkoutImage);

        const messageElement = document.createElement("h2");
        messageElement.textContent = "Your payment is successful.";

        const messageElement2 = document.createElement("h3");
        messageElement2.textContent = "Thanks for shopping with us!";
        
        afterCheckoutDiv.appendChild(messageElement);
        afterCheckoutDiv.appendChild(messageElement2);

        mainElement.appendChild(afterCheckoutDiv);

        appData["local-store-cart"] = [];

        const cartButtonElememt = document.querySelector(".cart-btn");
        cartButtonElememt.textContent = `CART (0)`
        
        window.localStorage.removeItem("local-store-cart");

    })

    checkoutSectionDivElement.appendChild(checkoutBtnElement);

    mainElement.appendChild(checkoutSectionDivElement);

    console.log(window.history.state.data.totalPrice);
}

function onAdd() {
    const inputfields = document.querySelectorAll('input');
    let alertShown = false;
    inputfields.forEach(function (el) {
        if (el.value === "" && !alertShown) {
            alertShown = true;
            alert("Please enter data!")
            return
        }
    })

    if (alertShown) {
        return;
    }

    const idElement = document.querySelector(".id");
    const exists = appData["local-store-products"].filter(el => el.id === Number(idElement.value));
    console.log(exists);

    if (exists.length > 0) {
        alert("Product is already added");
    } else {
        appData["local-store-products"].push({
            name: inputfields[0].value,
            price: Number(inputfields[1].value),
            image: inputfields[2].value,
            id: Number(inputfields[3].value)
        });
        setToLocalStorage("local-store-products", appData["local-store-products"]);
    }

    inputfields.forEach(function (el) {
        el.value = "";
    })
}

function renderAddProducts() {
    const mainElement = getMainElement();
    mainElement.innerHTML = "";
    mainElement.setAttribute("class", "main")

    //container
    const formContainerElement = document.createElement("div");
    formContainerElement.setAttribute("class", "form-section");

    //heading
    const headingElement = document.createElement("h2");
    headingElement.textContent = "Add product"
    headingElement.setAttribute("class", "add-product-heading");

    formContainerElement.appendChild(headingElement);

    //name
    const formNameLabelContainer = document.createElement("div");
    formNameLabelContainer.setAttribute("class", "form-label");

    const productNameElement = document.createElement("p");
    productNameElement.textContent = "Product Name";
    const inputNameElement = document.createElement("input");
    inputNameElement.setAttribute("type", "text");

    formNameLabelContainer.appendChild(productNameElement);
    formNameLabelContainer.appendChild(inputNameElement);

    formContainerElement.appendChild(formNameLabelContainer);

    //price
    const formPriceLabelContainer = document.createElement("div");
    formPriceLabelContainer.setAttribute("class", "form-label");

    const productPriceElement = document.createElement("p");
    productPriceElement.textContent = "Price";
    const inputPriceElement = document.createElement("input");
    inputPriceElement.setAttribute("type", "number");

    formPriceLabelContainer.appendChild(productPriceElement);
    formPriceLabelContainer.appendChild(inputPriceElement);

    formContainerElement.appendChild(formPriceLabelContainer);

    //image
    const formImageLabelContainer = document.createElement("div");
    formImageLabelContainer.setAttribute("class", "form-label");

    const productImageElement = document.createElement("p");
    productImageElement.textContent = "Image URL";
    const inputImageElement = document.createElement("input");
    inputImageElement.setAttribute("type", "text");


    formImageLabelContainer.appendChild(productImageElement);
    formImageLabelContainer.appendChild(inputImageElement);

    formContainerElement.appendChild(formImageLabelContainer);

    //id
    const formIDLabelContainer = document.createElement("div");
    formIDLabelContainer.setAttribute("class", "form-label");

    const productIDElement = document.createElement("p");
    productIDElement.textContent = "Add ID";
    const inputIDElement = document.createElement("input");
    inputIDElement.setAttribute("class", "id");
    inputIDElement.setAttribute("type", "number");


    formIDLabelContainer.appendChild(productIDElement);
    formIDLabelContainer.appendChild(inputIDElement);

    formContainerElement.appendChild(formIDLabelContainer);

    //submit - btn
    const submitBtnElement = document.createElement("button");
    submitBtnElement.textContent = "SUBMIT";
    submitBtnElement.setAttribute("type", "submit");
    submitBtnElement.setAttribute("class", "add-product-btn");

    submitBtnElement.addEventListener("click", onAdd);

    formContainerElement.appendChild(submitBtnElement);

    mainElement.appendChild(formContainerElement);

    // mainElement.textContent = "Add Products";
}

function renderApp() {
    const rootElement = document.querySelector("#root");

    appData["local-store-cart"] = getFromLocalStorage('local-store-cart') || [];

    appData["local-store-products"] = getFromLocalStorage("local-store-products") || [];

    const appContEl = document.createElement("div");
    appContEl.setAttribute("class", "app-container");

    const header = document.createElement("header");

    const homeButtonelement = document.createElement("button");
    homeButtonelement.textContent = "Home";
    homeButtonelement.setAttribute("class", "top-btn");
    homeButtonelement.addEventListener("click", function() {
        pushRoute('products');
    })

    const cartButtonEl = document.createElement("button");
    cartButtonEl.textContent = "Cart";
    cartButtonEl.textContent = `Cart (${appData["local-store-cart"].length})`
    cartButtonEl.setAttribute("class", "top-btn cart-btn");
    cartButtonEl.addEventListener("click", function() {
        pushRoute("cart");
    })

    // const checkoutButtonEl = document.createElement("button");
    // checkoutButtonEl.textContent = "Checkout";
    // checkoutButtonEl.setAttribute("class", "top-btn");
    // checkoutButtonEl.addEventListener("click", function() {
    //     pushRoute("checkout");
    // })

    const addprodButtonEl = document.createElement("button");
    addprodButtonEl.textContent = "Add Products";
    addprodButtonEl.setAttribute("class", "top-btn");
    addprodButtonEl.addEventListener("click", function() {
        pushRoute("addProducts")
    })

    header.appendChild(homeButtonelement);
    header.appendChild(cartButtonEl);
    //header.appendChild(checkoutButtonEl);
    header.appendChild(addprodButtonEl);

    appContEl.appendChild(header);

    const mainDivEl = document.createElement("div");
    mainDivEl.setAttribute("class", "main");

    appContEl.appendChild(mainDivEl);

    rootElement.appendChild(appContEl);

    routes.products.render();
}

renderApp();
