export function calculateTax(price: number, category: string) {
    const tax = 4.75;
    const groceriesTax = 3;

    if (category === "groceries") {
        return price * (groceriesTax / 100);
    } else {
        return price * (tax / 100)
    }
}