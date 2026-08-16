import { NetworkError, DataError, handleError } from "../utils/errorHandler";

export async function fetchData() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new NetworkError(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.products) {
            throw new DataError("Product data is missing.");
        }
        return data;
    } catch (error) {
        handleError(error);
    }
}
