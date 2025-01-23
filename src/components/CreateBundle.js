import React, { useState, useEffect } from "react";
import { createBundle, fetchProducts } from "../services/api";
import { toast } from "react-toastify";

const CreateBundle = () => {
    const [formData, setFormData] = useState({
        name: "",
        product_id: "",
        price: "",
        stock: "",
        description: "",
    });
    const [products, setProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState(""); // State untuk pesan alert
    const [alertType, setAlertType] = useState(""); // State untuk tipe alert (success atau error)
    const [isStockReadOnly, setIsStockReadOnly] = useState(false); // Untuk mengatur apakah stock bisa diedit

    useEffect(() => {
        fetchProducts()
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products", error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Jika nama produk dan bundle sama, set stok bundle mengikuti stok produk
        if (name === "name" && value === formData.product_id) {
            const selectedProduct = products.find(product => product.id === formData.product_id);
            if (selectedProduct) {
                setFormData({
                    ...formData,
                    stock: selectedProduct.stock, // Set stock bundle sama dengan stock product
                });
                setIsStockReadOnly(true); // Set stok menjadi read-only
            }
        }
    };

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        setFormData({
            ...formData,
            product_id: selectedProductId,
            stock: "", // Reset stock menjadi kosong atau default value
        });

        const selectedProduct = products.find(product => product.id === selectedProductId);
        if (selectedProduct) {
            setFormData({
                ...formData,
                stock: selectedProduct.stock, // Set stock bundle sesuai stock product
            });
            setIsStockReadOnly(false); // Biarkan stok bisa diedit jika produk baru dipilih
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi di Frontend
        if (!formData.name || !formData.product_id || !formData.price || !formData.stock || !formData.description) {
            setAlertMessage("All fields are required.");
            setAlertType("danger"); // Tampilkan alert error
            return;
        }

        createBundle(formData)
            .then((response) => {
                // Jika berhasil
                if (response.status === 201) {
                    setAlertMessage("Bundle created successfully!");
                    setAlertType("success"); // Tampilkan alert sukses
                    toast.success("Bundle created successfully");
                }
            })
            .catch((error) => {
                // Jika terjadi error
                if (error.response && error.response.data) {
                    const errorMessage = error.response.data.error || "An error occurred!";
                    setAlertMessage(`Failed to create bundle: ${errorMessage}`);
                    setAlertType("danger"); // Tampilkan alert error
                } else {
                    setAlertMessage("Failed to create bundle.");
                    setAlertType("danger"); // Tampilkan alert error
                }
                toast.error("Failed to create bundle.");
                console.error(error);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="w-50 mx-auto mt-4">
            <h2>Create Bundle</h2>

            {/* Alert untuk menampilkan pesan */}
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
                <select
                    name="product_id"
                    className="form-control"
                    onChange={handleProductChange}
                    required
                    value={formData.product_id}
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
                    readOnly={isStockReadOnly} // Stok menjadi read-only jika produk dan nama bundle sama
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

export default CreateBundle;
