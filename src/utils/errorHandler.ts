export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

export class DataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DataError";
    }
}

export function handleError(error: unknown): void {
    if (error instanceof NetworkError) {
        console.error("Network Error:", error.message);
    } else if (error instanceof DataError) {
        console.error("Data Error:", error.message);
    } else if (error instanceof Error) {
        console.error("Unexpected Error:", error.message);
    } else {
        console.error("Unknown error occurred.");
    }
}