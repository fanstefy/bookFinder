import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BookDetails from "./pages/BookDetails";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
