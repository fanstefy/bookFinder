import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "../services/api";
import { debounce } from "lodash";

interface Book {
  id: string;
  title: string;
}

interface InputProps {
  onSearchResults: (books: Book[]) => void;
}

const SearchInput: React.FC<InputProps> = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchTerm(query);
    }, 500),
    []
  );

  const { data: books } = useQuery({
    queryKey: ["searchBooks", searchTerm],
    queryFn: () => searchBooks(searchTerm),
    enabled: !!searchTerm.trim(),
  });

  useEffect(() => {
    if (books) {
      const filteredBooks = books.map((book: any) => ({
        id: book.key.replace("/works/", ""),
        title: book.title,
      }));

      onSearchResults(filteredBooks);
    }
  }, [books, onSearchResults]);

  return (
    <input
      type="text"
      placeholder="Search for books..."
      className="w-full p-2 border rounded"
      onChange={(e) => debouncedSearch(e.target.value)}
      aria-label="Search books"
    />
  );
};

export default SearchInput;
