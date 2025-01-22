import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateProduct from "./components/CreateProduct";
import CreateBundle from "./components/CreateBundle";
import PurchasePage from "./pages/PurchasePage";
import EditProduct from "./components/EditProduct";
import EditBundle from "./components/EditBundle";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <header className="bg-light py-3">
          <nav className="container">
            <Link to="/" className="btn btn-link mr-2">
              Home
            </Link>
            <Link to="/create-product" className="btn btn-link mr-2">
              Create Product
            </Link>
            <Link to="/create-bundle" className="btn btn-link">
              Create Bundle
            </Link>
            <Link to="/purchase" className="btn btn-link">
              Purchase
            </Link>
          </nav>
        </header>
        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/create-bundle" element={<CreateBundle />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/edit-bundle/:id" element={<EditBundle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
