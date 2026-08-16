import { calculateDiscount } from "../utils/discountCalculator";

export class Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;

    constructor(
        id: number,
        title: string,
        description: string,
        category: string,
        price: number,
        discountPercentage: number,
        thumbnail: string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.thumbnail = thumbnail;
    }

    displayDetails(): string {
        return `${this.id}: ${this.title} - ${this.category} - ${this.description} - ${this.price} - ${this.discountPercentage} - ${this.thumbnail}`
    }

    getPriceWithDiscount(): number {
        const discountAmount = calculateDiscount(this.price, this.discountPercentage);
        const finalPrice = this.price - discountAmount;
        return finalPrice;
    }
}