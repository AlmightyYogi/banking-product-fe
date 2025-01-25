import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateProduct from "./components/CreateProduct";
import CreateBundle from "./components/CreateBundle";
import EditProduct from "./components/EditProduct";
import EditBundle from "./components/EditBundle";
import BundleSelection from "./components/BundleSelection";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        {/* Header Section */}
        <header className="bg-primary text-white py-3">
          <nav className="container d-flex justify-content-between align-items-center">
            <h1 className="h4">
              <Link to="/" className="text-white text-decoration-none">
                Store Management System
              </Link>
            </h1>

            {/* Navigation Links */}
            <div>
              <Link to="/" className="btn btn-outline-light mx-2">
                Home
              </Link>
              <Link to="/create-product" className="btn btn-outline-light mx-2">
                Create Product
              </Link>
              <Link to="/create-bundle" className="btn btn-outline-light mx-2">
                Create Bundle
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/create-bundle" element={<CreateBundle />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/edit-bundle/:id" element={<EditBundle />} />
            <Route path="/bundles/:productId" element={<BundleSelection />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
