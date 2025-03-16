import { useState, useEffect, useCallback, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      onSearchResults(books);
    }
  }, [books, onSearchResults]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Title of book you like"
      className="w-[400px] items-center p-2 border rounded italic focus:border-customGreen outline-none focus:ring-1 focus:ring-customGreen"
      onChange={(e) => debouncedSearch(e.target.value)}
      aria-label="Search books"
    />
  );
};

export default SearchInput;
