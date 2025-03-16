import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface ViewedBooksProps {
  books: { id: string; title: string; coverId?: number }[];
}

const ViewedBooks: React.FC<ViewedBooksProps> = ({ books }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleBooks = 4;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const bookWidth = scrollRef.current.scrollWidth / books.length;
      const newIndex =
        direction === "left" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex >= 0 && newIndex + visibleBooks <= books.length) {
        setCurrentIndex(newIndex);
        scrollRef.current.scrollTo({
          left: bookWidth * newIndex,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="relative mt-6 pb-4 border-b">
      <h2 className="text-xl font-bold mb-3">Viewed Books</h2>
      <div className="flex items-center">
        {books.length > 4 && currentIndex > 0 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 bg-gray-100 border border-gray-500 p-2 shadow-md left-[-60px] hover:bg-customGreen hover:border-customGreen hover:text-white"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-hidden space-x-4 p-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {books.map((book, index) => (
            <div
              key={book.id}
              className={`relative w-40 min-w-[160px] min-h-[220px] shadow-md bg-white pb-2 flex flex-col justify-between h-full ${index === 0 ? "border-customGreen" : ""}`}
            >
              {index === 0 && (
                <div className="absolute top-0 left-0 w-full bg-customGreen text-white text-sm font-bold p-1 text-center">
                  Last Viewed
                </div>
              )}
              {book.coverId ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                  alt={book.title}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Cover
                </div>
              )}
              <div className="p-2 flex flex-col flex-grow justify-end">
                <h3 className="text-sm font-semibold mt-2 pl-2">
                  {book.title}
                </h3>
                <Link
                  to={`/book/${book.id}`}
                  className="text-gray-500 hover:text-customGreen text-xs pl-2 mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {currentIndex + visibleBooks < books.length && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 bg-gray-100 border border-black p-2 shadow-md right-[-60px] hover:bg-customGreen hover:border-customGreen hover:text-white"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewedBooks;
