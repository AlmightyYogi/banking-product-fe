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
        const fetchData = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };

        fetchData();
    }, []);

    const formatCurrencyInput = (value) => {
        const numericValue = value.replace(/\D/g, "");

        return new Intl.NumberFormat("id-ID").format(numericValue);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "name") {
            const matchingProduct = products.find(
                (product) => product.name.toLowerCase() === value.toLowerCase()
            );
    
            if (matchingProduct) {
                setFormData({
                    ...formData,
                    name: value,
                    product_id: matchingProduct.id,
                    stock: matchingProduct.stock,
                });
                setIsStockReadOnly(true); // Stok menjadi read-only
            } else {
                setFormData({ ...formData, name: value, product_id: "", stock: "" });
                setIsStockReadOnly(false); // Stok bisa diedit
            }
        } else if (name === "price") {
            setFormData({
                ...formData,
                price: formatCurrencyInput(value),
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        
        const selectedProduct = products.find((product) => product.id === selectedProductId);

        setFormData((prevFormData) => ({
            ...prevFormData,
            product_id: selectedProductId,
            stock: selectedProduct ? selectedProduct.stock : "",
        }));

        if (selectedProduct && selectedProduct.name.toLowerCase() === formData.name.toLowerCase()) {
            setIsStockReadOnly(true);
        } else {
            setIsStockReadOnly(false);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanPrice = formData.price.replace(/\./g, "");

        // Validasi di Frontend
        if (!formData.name || !formData.product_id || !formData.price || !formData.stock || !formData.description) {
            setAlertMessage("All fields are required.");
            setAlertType("danger"); // Tampilkan alert error
            return;
        }

        try {
            const response = await createBundle({
                ...formData,
                price: cleanPrice,
            });

            // Jika berhasil
            if (response.status === 201) {
                setAlertMessage("Bundle created successfully");
                setAlertType("success");
                toast.success("Bundle created successfully");

                setTimeout(() => window.location.reload(), 2000);
            }
        } catch(error) {
            // Jika terjadi error
            const errorMessage = error.response?.data?.error || "An error occured";
            setAlertMessage(`Failed to create bundle: ${errorMessage}`);
            setAlertType("danger");
            toast.error("Failed to create bundle");
            console.error(error);
        }
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
