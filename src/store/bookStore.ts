import { create } from "zustand";

type Book = {
  id: string;
  title: string;
  coverId: number;
};

type BookStore = {
  viewedBooks: Book[];
  addViewedBook: (book: Book) => void;
};

export const useBookStore = create<BookStore>((set) => ({
  viewedBooks: [],
  addViewedBook: (book) =>
    set((state) => ({
      viewedBooks: [book, ...state.viewedBooks.filter((b) => b.id !== book.id)],
    })),
}));
