export const searchBooks = async (searchTerm: string) => {
  const response = await fetch(
    `https://openlibrary.org/search.json?title=${searchTerm}`
  );
  const data = await response.json();
  return data.docs.filter((book: any) => book.cover_i); // Only books with covers
};

export const getBookDetails = async (id: string) => {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`);
  return response.json();
};
