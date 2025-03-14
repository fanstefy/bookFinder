import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BookItemProps {
  book: {
    id: string;
    title: string;
  };
  index: number;
}

const BookItem: React.FC<BookItemProps> = ({ book, index }) => {
  return (
    <motion.li
      className="transform transition-all duration-300"
      initial={{ opacity: 0, x: 3 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        to={`/book/${book.id}`}
        className="block p-2 hover:bg-gray-100 rounded"
      >
        {book.title}
      </Link>
    </motion.li>
  );
};

export default BookItem;
