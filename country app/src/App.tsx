import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";
import Favorites from "./pages/Favorites";
import Header from "./components/Header";
import { ToastContainer, Bounce } from "react-toastify"; // ✅ Import ToastContainer and Bounce transition
import "react-toastify/dist/ReactToastify.css";  // ✅ Import toast styles

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

      {/* ✅ Add ToastContainer at bottom */}
      <ToastContainer
  position="top-center"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  pauseOnHover
  draggable
  theme="dark"
  transition={Bounce} // Adds a nice bounce effect
  toastStyle={{
    background: "linear-gradient(to right, #2a2a2a, #444444)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "14px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
    fontSize: "16px",

  }}
  
/>
    </Router>
  );
}

export default App;
