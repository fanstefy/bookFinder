export const searchBooks = async (searchTerm: string) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${searchTerm}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data.docs
      .filter((book: any) => book.cover_i)
      .map((book: any) => ({
        id: book.key.replace("/works/", ""),
        title: book.title,
      }));
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
    return await response.json();
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};

// Fetch author details separately
export const getAuthorDetails = async (authorId: string) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/authors/${authorId}.json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching author details:", error);
    return { name: "Unknown" };
  }
};

// Fetch book editions to get publisher & ISBN
export const getBookEditions = async (id: string) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/works/${id}/editions.json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching book editions:", error);
    return null;
  }
};
