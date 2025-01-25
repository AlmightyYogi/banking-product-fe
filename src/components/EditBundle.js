import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBundleById, fetchProducts, updateBundle } from "../services/api";
import { toast } from "react-toastify";

const EditBundle = () => {
    const { id } = useParams();
    const [bundle, setBundle] = useState({
        name: "",
        product_id: "",
        price: "",
        stock: "",
        description: "",
    });
    const [products, setProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    useEffect(() => {
        // Mengambil data produk dan bundle berdasarkan ID
        const fetchData = async () => {
            try {
                const productResponse = await fetchProducts();
                setProducts(productResponse.data);

                const bundleResponse = await fetchBundleById(id);
                if (bundleResponse.data && bundleResponse.data.length > 0) {
                    setBundle(bundleResponse.data[0]); // Set data bundle ke form
                } else {
                    toast.error("Bundle not found");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch data");
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBundle((prevBundle) => ({
            ...prevBundle,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, product_id, price, stock, description } = bundle;

        if (!name || !product_id || !price || !stock || !description) {
            setAlertMessage("All fields are required");
            setAlertType("danger");
            return;
        }

        try {
            const response = await updateBundle(id, { name, product_id, price, stock, description });
            setAlertMessage(response.data.message);
            setAlertType("success");
            toast.success(response.data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to update bundle";
            setAlertMessage(errorMessage);
            setAlertType("danger");
            toast.error(errorMessage);
        }
    };

    return (
        <div>
            <h2>Edit Bundle</h2>

            {/* Alert untuk pesan */}
            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Bundle Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={bundle.name || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="product_id" className="form-label">Product</label>
                    <select
                        name="product_id"
                        className="form-control"
                        onChange={handleChange}
                        value={bundle.product_id || ""}
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={bundle.price || ""}
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
                        value={bundle.stock || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={bundle.description || ""}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Bundle</button>
            </form>
        </div>
    );
};

export default EditBundle;
