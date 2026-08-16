export function calculateDiscount(price: number, discountPercentage: number) {
    return price * (discountPercentage / 100);
}