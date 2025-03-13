import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBookStore } from "../store/bookStore";
import Input from "../components/Input";

const LandingPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const { viewedBooks } = useBookStore();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Input onSearchResults={setBooks} />

      <div className="mt-4 min-h-[400px]">
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
