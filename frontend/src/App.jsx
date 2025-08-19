import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Profile from "./pages/Profile";
import authStore from "../src/store/store.js";
import Protected from "./components/Protected";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const currentUser = authStore((store) => store.currentUser);

  const isAdmin = () => {
    return currentUser && currentUser.role === "admin";
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <Protected>
                  <Login />
                </Protected>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={currentUser ? <Cart /> : <Navigate to="/login" />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={currentUser ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={isAdmin() ? <AdminDashboard /> : <Home />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
