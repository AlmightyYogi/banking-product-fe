import React, { useEffect, useState } from "react";
import { fetchProducts, fetchBundles, purchaseItems } from "../services/api";
import { toast } from "react-toastify";

const PurchasePage = () => {
    const [products, setProducts] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedBundles, setSelectedBundles] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    useEffect(() => {
        fetchProducts().then((response) => {
            setProducts(response.data);
        }).catch((error) => {
            console.error("Error fetching products", error);
        });

        fetchBundles().then((response) => {
            setBundles(response.data);
        }).catch((error) => {
            console.error("Error fetching bundles", error);
        });
    }, []);

    const handleProductChange = (e) => {
        const { value, checked } = e.target;
        const quantityInput = e.target.closest('.form-check').querySelector('input[type="number"]'); // Ambil input quantity dalam div yang sama
        const quantity = parseInt(quantityInput.value || 1); // Ambil nilai quantity dari input

        if (quantity < 1) {
            setAlertMessage("Quantity must be at least 1.");
            setAlertType("danger");
            toast.error("Quantity must be at least 1.");
            return;
        }

        setSelectedProducts((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((product) => product.id === parseInt(value));
            if (checked) {
                if (index === -1) {
                    updated.push({ id: value, quantity: quantity });
                } else {
                    updated[index].quantity = quantity;
                }
            } else {
                updated.splice(index, 1);
            }
            return updated;
        });
    };

    const handleBundleChange = (e) => {
        const { value, checked } = e.target;
        const quantityInput = e.target.closest('.form-check').querySelector('input[type="number"]'); // Ambil input quantity dalam div yang sama
        const quantity = parseInt(quantityInput.value || 1); // Ambil nilai quantity dari input

        if (quantity < 1) {
            setAlertMessage("Quantity must be at least 1.");
            setAlertType("danger");
            toast.error("Quantity must be at least 1.");
            return;
        }

        setSelectedBundles((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((bundle) => bundle.id === parseInt(value));
            if (checked) {
                if (index === -1) {
                    updated.push({ id: value, quantity: quantity });
                } else {
                    updated[index].quantity = quantity;
                }
            } else {
                updated.splice(index, 1);
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi input
        if (selectedProducts.length === 0 && selectedBundles.length === 0) {
            setAlertMessage("No products or bundles selected for purchase.")
            setAlertType("danger");
            return;
        }

        purchaseItems({ products: selectedProducts, bundles: selectedBundles })
            .then((response) => {
                if (response.status === 200) {
                    setAlertMessage(`Purchase successful! Total cost: Rp.${response.data.totalCost}`);
                    setAlertType("success");
                    toast.success(`Purchase successful! Total cost: Rp.${response.data.totalCost}`);

                    // Refresh data produk dan bundle
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    const errorMessage = error.response.data.error || "An error occurred";
                    setAlertMessage(`Failed to process purchase: ${errorMessage}`);
                    setAlertType("danger");
                } else {
                    setAlertMessage("Failed to process purchase");
                    setAlertType("danger");
                }
                toast.error("Failed to process purchase");
                console.error(error);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="w-50 mx-auto mt-4">
            <h2>Purchase</h2>

            {/* Alert menampilkan pesan */}
            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                </div>
            )}

            <div className="mb-3">
                <h4>Select Products</h4>
                {products.map((product) => (
                    <div key={product.id} className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`product-${product.id}`}
                            value={product.id}
                            onChange={handleProductChange}
                        />
                        <label className="form-check-label" htmlFor={`product-${product.id}`}>
                            {product.name} - Rp.{product.price} (Stock: {product.stock})
                        </label>
                        <input
                            type="number"
                            className="form-control mt-2"
                            min="1"
                            max={product.stock}
                            defaultValue="1"
                            placeholder="Quantity"
                        />
                    </div>
                ))}
            </div>

            <div className="mb-3">
                <h4>Select Bundles</h4>
                {bundles.map((bundle) => (
                    <div key={bundle.id} className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`bundle-${bundle.id}`}
                            value={bundle.id}
                            onChange={handleBundleChange}
                        />
                        <label className="form-check-label" htmlFor={`bundle-${bundle.id}`}>
                            {bundle.name} - Rp.{bundle.price} (Stock: {bundle.stock})
                        </label>
                        <input
                            type="number"
                            className="form-control mt-2"
                            min="1"
                            max={bundle.stock}
                            defaultValue="1"
                            placeholder="Quantity"
                        />
                    </div>
                ))}
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Process Purchase
            </button>
        </form>
    );
};

export default PurchasePage;
