import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookDetails } from "../services/api";
import { useBookStore } from "../store/bookStore";
import Spinner from "../components/Spinner";

// interface Author {
//   name: string;
// }

// interface Book {
//   title: string;
//   covers?: number[];
//   authors?: Author[];
//   publishers?: string[];
//   isbn?: string[];
// }

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading } = useQuery({
    queryKey: ["bookDetails", id],
    queryFn: () => getBookDetails(id || ""),
    enabled: !!id,
  });
  const { addViewedBook } = useBookStore();

  React.useEffect(() => {
    if (book && id) {
      addViewedBook({
        id: id,
        title: book.title,
        coverId: book.covers?.[0],
      });
    }
  }, [book, id, addViewedBook]);

  if (isLoading) return <Spinner />;
  if (!book) return <p>No book found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      {book.covers && book.covers.length > 0 && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
          alt={`Cover of ${book.title}`}
          className="my-4"
        />
      )}
      <p>
        Author: {book.authors?.map((a: any) => a.name).join(", ") || "Unknown"}
      </p>
      <p>Publisher: {book.publishers?.[0] || "Unknown"}</p>
      <p>ISBN: {book.isbn?.[0] || "N/A"}</p>
    </div>
  );
};

export default BookDetails;
