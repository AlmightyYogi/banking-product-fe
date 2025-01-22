import React from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import BundleList from "../components/BundleList";

const HomePage = () => {
  return (
    <div className="container mt-5">
      <h1>Welcome to the Store Management System</h1>
      <p>This system allows you to:</p>
      <ul>
        <li>Create and manage products.</li>
        <li>Create bundles that group multiple products together.</li>
        <li>View the list of all products and bundles.</li>
      </ul>
      <p>Use the navigation links below to get started:</p>
      <nav>
        <Link to="/create-product" className="btn btn-secondary me-2">
          Create Product
        </Link>
        <Link to="/create-bundle" className="btn btn-secondary me-2">
          Create Bundle
        </Link>
        <Link to="/purchase" className="btn btn-primary me-2">
          Purchase Products & Bundles
        </Link>
      </nav>
      <hr />
      <h2>Product and Bundle Overview</h2>
      <p>Below, you can find a list of all products and bundles available in the system:</p>
      <ProductList />
      <BundleList />
    </div>
  );
};

export default HomePage;
