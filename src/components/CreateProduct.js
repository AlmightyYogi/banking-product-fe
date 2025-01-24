import React, { useState } from "react";
import { createProduct } from "../services/api";

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
    });
    const [alertMessage, setAlertMessage] = useState(""); // State untuk menyimpan pesan alert
    const [alertType, setAlertType] = useState(""); // State untuk tipe alert (success atau error)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi di Frontend
        if (!formData.name || !formData.price || !formData.stock || !formData.description) {
            setAlertMessage("All fields are required.");
            setAlertType("danger"); // Menampilkan alert error
            return;
        }

        try {
            const response = await createProduct(formData);

            // Kalo berhasil, tampilkan pesan sukses
            if (response.status === 200) {
                setAlertMessage("Product created successfully");
                setAlertType("success");
            }
        } catch (error) {
            // Jika gagal, tampilkan pesan error
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error || "An error occured";
                setAlertMessage(`Failed to create product: ${errorMessage}`);
                setAlertType("danger");
            } else {
                setAlertMessage("Failed to create product");
                setAlertType("danger");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-50 mx-auto mt-4">
            <h2>Create Product</h2>
            
            {/* Alert if there is a message */}
            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                </div>
            )}
            
            <div className="mb-3">
                <input
                    name="name"
                    placeholder="Name"
                    className="form-control"
                    onChange={handleChange}
                    required
                    value={formData.name}
                />
            </div>
            <div className="mb-3">
                <input
                    name="price"
                    placeholder="Price"
                    className="form-control"
                    onChange={handleChange}
                    required
                    value={formData.price}
                />
            </div>
            <div className="mb-3">
                <input
                    name="stock"
                    placeholder="Stock"
                    className="form-control"
                    onChange={handleChange}
                    required
                    value={formData.stock}
                />
            </div>
            <div className="mb-3">
                <textarea
                    name="description"
                    placeholder="Description"
                    className="form-control"
                    onChange={handleChange}
                    required
                    value={formData.description}
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">
                Create
            </button>
        </form>
    );
};

export default CreateProduct;
