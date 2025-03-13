import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookDetails } from "../services/api";
import { useBookStore } from "../store/bookStore";
import Spinner from "../components/Spinner";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [book, setBook] = useState<any>(null);
  const { addViewedBook } = useBookStore();

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const data = await getBookDetails(id);
      setBook(data);
      if (data) {
        addViewedBook({ id, title: data.title, coverId: data.covers?.[0] });
      }
    };
    fetchBook();
  }, [id, addViewedBook]);

  if (!book) return <Spinner />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      {book.covers && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
          alt={book.title}
        />
      )}
      <p>Author: {book.authors?.map((a: any) => a.name).join(", ")}</p>
      <p>Publisher: {book.publishers?.[0]}</p>
      <p>ISBN: {book.isbn?.[0]}</p>
    </div>
  );
};

export default BookDetails;
