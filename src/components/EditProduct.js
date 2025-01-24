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
        // Menangkap data product berdasarkan id
        const fetchData = async () => {
            try {
                // Melakukan pengecekan product berdasarkan id
                const [response] = await Promise.all([fetchProductById(id)]);
                if (response.data && response.data.length > 0) {
                    setProduct(response.data[0]);
                } else {
                    toast.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to fetch product data.");
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, price, stock, description } = product;

        try {
            const response = await updateProduct(id, { name, price, stock, description });

            // Menangani respon sukses
            setAlertMessage(response.data.message);
            setAlertType("success");
            toast.success(response.data.message);
            navigate("/");
        } catch (error) {
            // Menangani error
            const errorMessage = error.response?.data?.error || "Failed to update product";
            setAlertMessage(errorMessage);
            setAlertType("danger");
            toast.error(errorMessage);
        }
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
