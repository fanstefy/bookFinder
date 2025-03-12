export const searchBooks = async (searchTerm: string) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${searchTerm}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.docs.filter((book: any) => book.cover_i);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export const getBookDetails = async (id: string) => {
  try {
    const response = await fetch(`https://openlibrary.org/works/${id}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};
