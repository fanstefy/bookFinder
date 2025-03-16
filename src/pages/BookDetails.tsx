import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getBookDetails,
  getAuthorDetails,
  getBookEditions,
} from "../services/api";
import { useBookStore } from "../store/bookStore";
import Spinner from "../components/Spinner";

interface Author {
  author: {
    key: string;
  };
}

// Helper function
const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "No information available.";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addViewedBook } = useBookStore();

  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ["bookDetails", id],
    queryFn: () => getBookDetails(id || ""),
    enabled: !!id,
  });

  console.log("book: ", book);

  const { data: authors, isLoading: isAuthorsLoading } = useQuery({
    queryKey: ["bookAuthors", book?.authors],
    queryFn: async () => {
      if (!book?.authors) return [];
      const authorPromises = book.authors.map(async (authorObj: Author) => {
        const authorId = authorObj.author.key.split("/").pop();
        if (authorId) {
          try {
            const authorData = await getAuthorDetails(authorId);
            return authorData.name;
          } catch (error) {
            console.error("Error fetching author:", error);
            return "Unknown";
          }
        }
        return "Unknown";
      });
      return Promise.all(authorPromises);
    },
    enabled: !!book?.authors && book.authors.length > 0,
  });

  const { data: editions, isLoading: isEditionsLoading } = useQuery({
    queryKey: ["bookEditions", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const editionsData = await getBookEditions(id);
        return editionsData?.entries?.[0] || {};
      } catch (error) {
        console.error("Error fetching editions:", error);
        return {};
      }
    },
    enabled: !!id,
  });

  const { data: bookCover, isLoading: isCoverLoading } = useQuery({
    queryKey: ["bookCover", book?.covers?.[0]],
    queryFn: () => {
      if (!book?.covers?.length) return null;
      return `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`;
    },
    enabled: !!book?.covers?.length,
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

  const isLoading = isBookLoading || isAuthorsLoading || isEditionsLoading;

  if (!bookCover || isLoading) return <Spinner />;

  const getDescription = () => {
    if (!book) return "No description available.";
    if (typeof book.description === "string") {
      return truncateText(book.description, 300);
    } else if (book.description?.value) {
      return truncateText(book.description.value, 300);
    }
    return "No description available.";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center md:items-start gap-6 mt-10">
      {isCoverLoading ? (
        <div className="w-64 h-80 bg-gray-100 animate-pulse rounded-md"></div>
      ) : bookCover ? (
        <img
          src={bookCover}
          alt={`Cover of ${book?.title}`}
          className="w-64 h-auto shadow-md rounded-md"
          loading="lazy"
        />
      ) : (
        <div className="w-64 h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
          No Cover Available
        </div>
      )}

      <div className="flex flex-col justify-between flex-1 max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book?.title}</h1>

        <div className={isAuthorsLoading ? "animate-pulse" : ""}>
          <p className="text-gray-700 text-lg mb-2">
            <strong className="text-gray-900">Author:</strong>{" "}
            {isAuthorsLoading
              ? "Loading..."
              : authors?.length
                ? authors.join(", ")
                : "Unknown"}
          </p>
        </div>

        <div className={isEditionsLoading ? "animate-pulse" : ""}>
          <p className="text-gray-700 text-lg mb-2">
            <strong className="text-gray-900">Publisher:</strong>{" "}
            {isEditionsLoading
              ? "Loading..."
              : editions?.publishers?.[0] || "Unknown"}
          </p>

          <p className="text-gray-700 text-lg mb-2">
            <strong className="text-gray-900">ISBN:</strong>{" "}
            {isEditionsLoading ? "Loading..." : editions?.isbn_13?.[0] || "N/A"}
          </p>
        </div>

        <p className="text-gray-700 text-lg mb-2">
          <strong className="text-gray-900">Description:</strong>{" "}
          {getDescription()}
        </p>
      </div>
    </div>
  );
};

export default BookDetails;
