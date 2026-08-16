import { calculateTax } from "./utils/taxCalculator";
import type { ProductData } from "./types/ProductData";

const cartMessage = document.querySelector<HTMLParagraphElement>("#cart-message");
const cartSubtotalElement = document.querySelector<HTMLElement>("#cart-subtotal");
const cartTotalElement = document.querySelector<HTMLElement>("#cart-total");
const searchForm = document.querySelector<HTMLFormElement>("#cart-search-form");
const searchInput = document.querySelector<HTMLInputElement>("#cart-search");
const cartCount = document.querySelector<HTMLElement>("#cart-count");
const cartIcon = document.querySelector<HTMLImageElement>("#cart-icon");


let cartSubtotal = 0;
let cartTax = 0;

const savedMessage = sessionStorage.getItem("cartMessage");

if (cartMessage && savedMessage) {
    cartMessage.textContent = savedMessage;
    sessionStorage.removeItem("cartMessage");
}

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTerm: string = searchInput?.value.trim().toLowerCase() ?? "";

    const cartRows = document.querySelectorAll<HTMLDivElement>(".cart-item");

    cartRows.forEach((row) => {
        const title = row.dataset.title ?? "";

        if (title.includes(searchTerm)) {
            row.style.removeProperty("display");
        } else {
            row.style.display = "none";
        }

    });
});

const savedCart = localStorage.getItem("cart");

const cart: ProductData[] = savedCart
    ? JSON.parse(savedCart)
    : [];

if (cartCount) {
    cartCount.textContent =
        cart.length === 1
            ? "1 item"
            : `${cart.length} items`;
}

if (cartIcon && cart.length > 0) {
    cartIcon.src = "./src/assets/serenitea_full_cart.png";
}


const cartItems = document.querySelector<HTMLDivElement>("#cart-items");

interface CartItem {
    product: ProductData;
    quantity: number;
}

const cartWithQuantity: CartItem[] = [];

cart.forEach((product) => {

    const existingItem = cartWithQuantity.find((item) => {
        return item.product.id === product.id;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartWithQuantity.push({
            product: product,
            quantity: 1
        });
    }
});

cartWithQuantity.forEach((item) => {
    const product = item.product;
    const discountAmount = product.price * (product.discountPercentage / 100);
    const discountedPrice = product.price - discountAmount;
    const itemSubtotal = discountedPrice * item.quantity;
    const itemTax = calculateTax(discountedPrice, product.category) * item.quantity;
    cartSubtotal += itemSubtotal;
    cartTax += itemTax;
    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");
    cartItem.dataset.title = product.title.toLowerCase();

    cartItem.innerHTML = `
        <div class="cart-product">
            <img src="${product.thumbnail}" alt="${product.title}">
            <p>${product.title}</p>
        </div>

        <div class="cart-quantity">
            <input
                type="number"
                min="1"
                value="${item.quantity}"
                class="quantity-input"
                data-id="${product.id}"
            >

            <button
                type="button"
                class="update-cart-btn"
                data-id="${product.id}"
            >
                Update
            </button>
        </div>

        <div class="cart-item-subtotal">
            $${itemSubtotal.toFixed(2)}
        </div>

        <button
            type="button"
            class="remove-cart-btn"
            data-id="${product.id}"
        >
            Remove
        </button>
    `;

    cartItems?.append(cartItem);
});

cartItems?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains("remove-cart-btn")) {
        const productId = Number(target.dataset.id);

        const productToRemove = cart.find((product) => {
            return product.id === productId;
        });

        const updatedCart = cart.filter((product) => {
            return product.id !== productId;
        });

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        if (productToRemove) {
            sessionStorage.setItem(
                "cartMessage", 
                `${productToRemove.title} was removed from your cart.`
            );
        }

        window.location.reload();
    }

    if (target.classList.contains("update-cart-btn")) {
        const productId = Number(target.dataset.id);

        const quantityInput = document.querySelector<HTMLInputElement>(
            `.quantity-input[data-id="${productId}"]`
        );
        if (!quantityInput) {
            return;
        }

        const newQuantity = Number(quantityInput.value);

        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            return;
        }

        const productToUpdate = cart.find((product) => {
            return product.id === productId;
        });
        if (!productToUpdate) {
            return;
        }

        const firstIndex = cart.findIndex((product) => {
            return product.id === productId;
        });

        const updatedCart = cart.filter((product) => {
            return product.id !== productId;
        });

        const updatedQuantity = [];

        for (let i = 0; i <newQuantity; i++) {
            updatedQuantity.push(productToUpdate);
        }

        updatedCart.splice(firstIndex, 0, ...updatedQuantity);

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        sessionStorage.setItem(
            "cartMessage",
            `${productToUpdate.title} quantity updated to ${newQuantity}.`
        );

        window.location.reload();
    }
});

if (cartSubtotalElement) {
    cartSubtotalElement.textContent = `$${cartSubtotal.toFixed(2)}`;
}

const totalAfterTax = cartSubtotal + cartTax;
if (cartTotalElement) {
    cartTotalElement.textContent = `$${totalAfterTax.toFixed(2)}`;
}