import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getBookDetails,
  getAuthorDetails,
  getBookEditions,
} from "../services/api";
import { useBookStore } from "../store/bookStore";
import Spinner from "../components/Spinner";
import { truncateText } from "../utils/utils";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addViewedBook } = useBookStore();

  // fetch book details
  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ["bookDetails", id],
    queryFn: () => getBookDetails(id ?? ""),
    enabled: !!id,
  });

  // fetch author details 
  const { data: authorNames = [], isLoading: authorsLoading } = useQuery({
    queryKey: ["authorDetails", JSON.stringify(book?.authors)],
    queryFn: async () => {
      if (!book?.authors) return [];
      const authorPromises = book.authors.map(async (authorObj: any) => {
        const authorId = authorObj.author.key.split("/").pop();
        return authorId ? (await getAuthorDetails(authorId)).name : "Unknown";
      });
      return Promise.all(authorPromises);
    },
    enabled: !!book?.authors?.length,
  });

  // fetch book editions
  const { data: editionsData, isLoading: editionsLoading } = useQuery({
    queryKey: ["bookEditions", id],
    queryFn: () => getBookEditions(id ?? ""),
    enabled: !!id,
  });

  const publisher = editionsData?.entries?.[0]?.publishers?.[0] || "Unknown";
  const isbn = editionsData?.entries?.[0]?.isbn_13?.[0] || "N/A";

  const bookCoverUrl = book?.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
    : null;

  // check if the book cover image exists
  const { data: bookCover, isLoading: coverLoading } = useQuery({
    queryKey: bookCoverUrl ? ["bookCover", bookCoverUrl] : ["bookCover", "none"],
    queryFn: async () => {
      if (!bookCoverUrl) return null;
      return new Promise<string | null>((resolve) => {
        const img = new Image();
        img.src = bookCoverUrl;
        img.onload = () => resolve(bookCoverUrl);
        img.onerror = () => resolve(null);
      });
    },
    enabled: !!bookCoverUrl,
  });

  useEffect(() => {
    if (book && id) {
      addViewedBook({
        id: id,
        title: truncateText(book.title, 30),
        coverId: book.covers?.[0],
      });
    }
  }, [book, id, addViewedBook]);

  if (bookLoading || authorsLoading || editionsLoading || coverLoading)
    return <Spinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center md:items-start gap-6 mt-10">
      {bookCover ? (
        <img
          src={bookCover}
          alt={`Cover of ${book?.title}`}
          className="w-64 h-auto shadow-md rounded-md"
        />
      ) : (
        <div className="w-64 h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
          No Cover Available
        </div>
      )}

      <div className="flex flex-col justify-between max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book?.title}</h1>
        <p className="text-gray-700 text-lg">
          <strong className="text-gray-900">Author:</strong>{" "}
          {authorNames.length ? authorNames.join(", ") : "Unknown"}
        </p>
        <p className="text-gray-700 text-lg">
          <strong className="text-gray-900">Publisher:</strong> {publisher}
        </p>
        <p className="text-gray-700 text-lg">
          <strong className="text-gray-900">ISBN:</strong> {isbn}
        </p>
        <p className="text-gray-700 text-lg">
          <strong className="text-gray-900">Description:</strong>{" "}
          {typeof book.description === "string"
            ? truncateText(book.description, 300)
            : truncateText(book.description?.value, 300) ||
              "No description available."}
        </p>
      </div>
    </div>
  );
};

export default BookDetails;
