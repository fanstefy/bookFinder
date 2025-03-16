import "./LandingPage.css";
import { useState } from "react";
import { useBookStore } from "../store/bookStore";
import SearchInput from "../components/SearchInput";
import BookItem from "../components/BookItem";
import ViewedBooks from "../components/ViewedBooks";
import Navbar from "../components/Navbar";

interface Book {
  id: string;
  title: string;
}

const LandingPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { viewedBooks } = useBookStore();

  return (
    <div className="p-2 max-w-[746px] mx-auto">
      <Navbar />
      <h1 className="[text-align-last:center] mb-4 mt-12">
        FIND THE NEXT BOOK YOU LOVE
      </h1>
      <div className="flex justify-center">
        <SearchInput onSearchResults={setBooks} />
      </div>

      <div className="w-md mt-4 mb-4 h-[370px]">
        <h2 className="text-xl font-bold mb-3 text-center text-gray-700">
          Search Results
        </h2>
        <ul className="space-y-2 max-h-[350px] overflow-y-scroll overflow-x-hidden overflow-hidden text-center">
          {books.map((book, index) => (
            <BookItem key={book.id} book={book} index={index} />
          ))}
        </ul>
        {books.length === 0 && (
          <p className="text-gray-500 mt-2 text-center">No search results.</p>
        )}
      </div>

      {viewedBooks.length > 0 && <ViewedBooks books={viewedBooks} />}
    </div>
  );
};

export default LandingPage;
