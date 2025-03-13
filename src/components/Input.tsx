import React, { useState } from "react";
import { searchBooks } from "../services/api";
import { debounce } from "lodash";

interface InputProps {
  onSearchResults: (books: any[]) => void;
}

const Input: React.FC<InputProps> = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = debounce(async (query: string) => {
    if (query.trim()) {
      const results = await searchBooks(query);
      onSearchResults(results);
    }
  }, 500);

  return (
    <input
      type="text"
      placeholder="Search for books..."
      className="w-full p-2 border rounded"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
};

export default Input;
