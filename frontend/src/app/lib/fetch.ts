const fetchData = async (url: string, page: number, limit: number, query: string) => {
    try {
        const response = await fetch(
            `${url}?page=${page}&limit=${limit}&value=${query}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch staff");
        }
        return await response.json();
    } catch (error) {
        throw error
    }
};

export default fetchData