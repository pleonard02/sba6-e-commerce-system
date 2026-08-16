import { Product } from "./models/Product";
import { calculateTax } from "./utils/taxCalculator";
import { fetchData } from "./services/apiService";

const productCards = document.querySelectorAll<HTMLDivElement>(".description-container");
const cartCount = document.querySelector<HTMLElement>("#cart-count");
const cartIcon = document.querySelector<HTMLImageElement>("#cart-icon");
const cartButton =
    document.querySelector<HTMLButtonElement>("#cart-btn");

if (cartButton) {
    cartButton.addEventListener("click", () => {
        window.location.href = "./cart.html";
    });
}


interface ProductData {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
}

/* So, I am using this project to pitch a website redesign for my friends' business. Their products are more niche so I am narrowing the accepted categories by what you could potentially find in their store's backend*/ 
const allowedCategories = [
    "groceries",
    "beauty",
    "fragrances",
    "home-decoration",
    "kitchen-accessories"
];

const savedCart = localStorage.getItem("cart");

const cart: ProductData[] = savedCart
    ? JSON.parse(savedCart)
    : [];

if (cartCount) {
    cartCount.textContent = 
    cart.length === 1
        ? "1 item"
        : `${cart.length} items`
}

if (cartIcon && cart.length > 0) {
    cartIcon.src = "./src/assets/serenitea_full_cart.png";
}

async function runApp() {
    const data = await fetchData();

    const products = data.products;
    
    const productInstances = products.map((product: ProductData) => {
        return new Product(
            product.id,
            product.title,
            product.description,
            product.category,
            product.price,
            product.discountPercentage,
            product.thumbnail
        );
    });

    const allowedProducts = productInstances.filter((product: Product) => {
        return allowedCategories.includes(product.category);
    });

    /* Displaying 8 random products on the landing page*/
    const shuffledProducts = [...allowedProducts]
        .sort(() => Math.random() - 0.5);
        
    const featuredProducts = shuffledProducts.slice(0, 8);

    featuredProducts.forEach((product, index) => {
        const card = productCards[index];
    
        const productName = card.querySelector<HTMLElement>(".product-name");

        const productImage = card.querySelector<HTMLImageElement>("img");

        const productDescription = card.querySelector<HTMLParagraphElement>(".description");
        
        const productPrice = card.querySelector<HTMLParagraphElement>(".product-price");

        const discountedPrice = card.querySelector<HTMLParagraphElement>(".price-after-discount");

        const addToCartButton = card.querySelector<HTMLButtonElement>(".add-to-cart-btn");

        if (productName) {
            productName.textContent = product.title;
        }

        if (productImage) {
            productImage.src = product.thumbnail;
        }

        if (productDescription) {
            productDescription.textContent = product.description;
        }

        if (productPrice) {
            productPrice.textContent = `$${product.price.toFixed(2)}`;
        }

        if (discountedPrice) {
            discountedPrice.textContent = `Sale: $${product.getPriceWithDiscount().toFixed(2)}`;
        }

        if (addToCartButton) {
            addToCartButton.addEventListener("click", () => {
                cart.push(product);

                localStorage.setItem("cart", JSON.stringify(cart));

                if(cartCount) {
                    cartCount.textContent = 
                        cart.length === 1
                            ? "1 item"
                            : `${cart.length} items`;
                }

                if (cartIcon) {
                    cartIcon.src = "./src/assets/serenitea_full_cart.png";
                }

                console.log(cart);
            });
        }

    });

    console.log(featuredProducts);

    productInstances.forEach((product: Product) => {
        console.log(product.displayDetails());
        console.log(product.getPriceWithDiscount());
        console.log(calculateTax(product.price, product.category).toFixed(2));
    });
}

runApp();