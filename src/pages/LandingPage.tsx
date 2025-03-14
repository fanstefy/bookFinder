import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBookStore } from "../store/bookStore";
import SearchInput from "../components/SearchInput";
import BookItem from "../components/BookItem";

interface Book {
  id: string;
  title: string;
}

const LandingPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { viewedBooks } = useBookStore();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SearchInput onSearchResults={setBooks} />

      <div className="mt-4 min-h-[400px]">
        <h2 className="text-xl font-bold mb-3">Search Results</h2>
        <ul className="space-y-2">
          {books.map((book, index) => (
            <BookItem key={book.id} book={book} index={index} />
          ))}
        </ul>
        {books.length === 0 && (
          <p className="text-gray-500 mt-2">No search results.</p>
        )}
      </div>

      {viewedBooks.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Viewed Books</h2>
          <ul>
            {viewedBooks.map((book) => (
              <li key={book.id}>
                <Link to={`/book/${book.id}`}>{book.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
