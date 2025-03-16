import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getBookDetails,
  getAuthorDetails,
  getBookEditions,
} from "../services/api";
import { useBookStore } from "../store/bookStore";
import Spinner from "../components/Spinner";

const truncateText = (text: string, maxLength: number) =>
  text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addViewedBook } = useBookStore();

  const { data: book, isLoading } = useQuery({
    queryKey: ["bookDetails", id],
    queryFn: () => getBookDetails(id || ""),
    enabled: !!id,
  });

  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [publisher, setPublisher] = useState<string>("Unknown");
  const [isbn, setIsbn] = useState<string>("N/A");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [bookCover, setBookCover] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (book?.authors) {
        const authorPromises = book.authors.map(async (authorObj: any) => {
          const authorId = authorObj.author.key.split("/").pop();
          if (authorId) {
            const authorData = await getAuthorDetails(authorId);
            return authorData.name;
          }
          return "Unknown";
        });
        const authorResults = await Promise.all(authorPromises);
        setAuthorNames(authorResults);
      }
    };

    const fetchEditions = async () => {
      if (id) {
        const editionsData = await getBookEditions(id);
        if (editionsData?.entries?.length > 0) {
          setPublisher(editionsData.entries[0]?.publishers?.[0] || "Unknown");
          setIsbn(editionsData.entries[0]?.isbn_13?.[0] || "N/A");
        }
      }
      setDataLoaded(true);
    };

    fetchAuthors();
    fetchEditions();
  }, [book, id]);

  useEffect(() => {
    if (book && id) {
      addViewedBook({
        id: id,
        title: truncateText(book.title, 30),
        coverId: book.covers?.[0],
      });
    }
  }, [book, id, addViewedBook]);

  useEffect(() => {
    if (book?.covers?.length) {
      const img = new Image();
      img.src = `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
      img.onload = () => {
        setBookCover(img.src);
        setImageLoaded(true);
      };
      img.onerror = () => setImageLoaded(true);
    } else {
      setImageLoaded(true);
    }
  }, [book]);

  if (isLoading || !dataLoaded || !bookCover) return <Spinner />;

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
