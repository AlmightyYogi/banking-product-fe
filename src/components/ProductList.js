import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Menangkap data product
        const fetchData = async () => {
            try {
                const [productResponse] = await Promise.all([fetchProducts()]);
                setProducts(productResponse.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (productId) => {
        navigate(`/bundles/${productId}`);
    };

    const handleEditClick = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Product List</h2>
            <div className="row">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="col-md-4 mb-4"
                        onClick={() => handleCardClick(product.id)}
                    >
                        <div className="card product-card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    <strong>Price:</strong> {product.price}
                                </p>
                                <p className="card-text">
                                    <strong>Stock:</strong> {product.stock}
                                </p>
                                <p className="card-text">
                                    <strong>Description:</strong> {product.description || "No description available."}
                                </p>
                                <button
                                    className="btn btn-warning mt-2"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Cegah navigasi ke halaman bundle
                                        handleEditClick(product.id);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;