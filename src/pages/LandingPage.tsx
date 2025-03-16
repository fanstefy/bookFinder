import React, { useState } from "react";
import "./LandingPage.css";
import { useBookStore } from "../store/bookStore";
import SearchInput from "../components/SearchInput";
import BookItem from "../components/BookItem";
import ViewedBooks from "../components/ViewedBooks";

interface Book {
  id: string;
  title: string;
}

const LandingPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { viewedBooks } = useBookStore();

  return (
    <div className="p-6 max-w-[746px] mx-auto">
      <h1 className="[text-align-last:center] mb-4">
        FIND THE NEXT BOOK YOU LOVE
      </h1>
      <div className="flex justify-center">
        <SearchInput onSearchResults={setBooks} />
      </div>

      <div className="w-md mt-4 mb-4 h-[370px]">
        <h2 className="text-xl font-bold mb-3">Search Results</h2>
        <ul className="space-y-2 max-h-[350px] overflow-y-scroll overflow-x-hidden overflow-hidden text-center">
          {books.map((book, index) => (
            <BookItem key={book.id} book={book} index={index} />
          ))}
        </ul>
        {books.length === 0 && (
          <p className="text-gray-500 mt-2">No search results.</p>
        )}
      </div>

      {viewedBooks.length > 0 && <ViewedBooks books={viewedBooks} />}
    </div>
  );
};

export default LandingPage;
