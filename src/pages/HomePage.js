import React from "react";
import ProductList from "../components/ProductList";

const HomePage = () => {
  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="jumbotron bg-primary text-white text-center py-5">
        <h1 className="display-4">Welcome to the Store Management System</h1>
        <p className="lead">Manage your products and bundles effortlessly.</p>
      </div>

      {/* Features Section */}
      <section className="my-5">
        <h3 className="text-primary mb-4">What You Can Do</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <i className="bi bi-check-circle me-2 text-success"></i> Create and manage products
          </li>
          <li className="list-group-item">
            <i className="bi bi-check-circle me-2 text-success"></i> Create bundles that group multiple products together
          </li>
          <li className="list-group-item">
            <i className="bi bi-check-circle me-2 text-success"></i> View the list of all products and bundles
          </li>
        </ul>
      </section>

      <hr className="my-5" />

      {/* Product and Bundle Overview Section */}
      <section>
        <h2 className="text-center text-primary mb-4">Product and Bundle Overview</h2>
        <p className="text-center mb-4">
          Below, you can find a list of all products and bundles available in the system:
        </p>
        <ProductList />
      </section>
    </div>
  );
};

export default HomePage;
