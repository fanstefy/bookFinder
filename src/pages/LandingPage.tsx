import React, { useState } from "react";
import { searchBooks } from "../services/api";
import { Link } from "react-router-dom";
import { useBookStore } from "../store/bookStore";

const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const { viewedBooks } = useBookStore();

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const results = await searchBooks(searchTerm);
      setBooks(results);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search for books..."
        className="w-full p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Search Results</h2>
        <ul>
          {books.map((book) => (
            <li key={book.key}>
              <Link to={`/book/${book.key.replace("/works/", "")}`}>
                {book.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Previously Viewed Books</h2>
        <ul>
          {viewedBooks.map((book) => (
            <li key={book.id}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
