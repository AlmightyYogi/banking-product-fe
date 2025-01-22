import React, { useEffect, useState } from "react";
import { fetchProductById, updateProduct } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
    });
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    useEffect(() => {
        // console.log("Fetching product with id:", id);
        fetchProductById(id).then((response) => {
            // console.log("Product data received:", response.data);
            
            // Cek kalo response.data adalah array dan ambil yg pertama
            if (response.data && response.data.length > 0) {
                setProduct(response.data[0]);
            } else {
                console.error("Product not found");
                toast.error("Product not found")
            }
        }).catch((error) => {
            console.error("Error fetching product:", error);
            toast.error("Failed to fetch product data.");
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, price, stock, description } = product;

        updateProduct(id, { name, price, stock, description })
            .then((response) => {
                setAlertMessage(response.data.message);
                setAlertType("success");
                toast.success(response.data.message);
                navigate("/");
            })
            .catch((error) => {
                setAlertMessage(error.response?.data?.error || "Failed to update product");
                setAlertType("danger");
                toast.error(error.response?.data?.error || "Failed to update product");
            });
    };

    // console.log("Product state:", product);

    return (
        <div>
            <h2>Edit Product</h2>

            {/* Alert untuk pesan */}
            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={product.name || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={product.price || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={product.stock || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={product.description || ""}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;
