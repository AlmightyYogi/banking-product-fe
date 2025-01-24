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
        const fetchData = async () => {
            try {
                // Mengambil data products dan bundles secara parallel
                const [productResponse, bundleResponse] = await Promise.all([
                    fetchProducts(),
                    fetchBundles(),
                ]);

                // Menyimpan hasilnya ke dalam state
                setProducts(productResponse.data);
                setBundles(bundleResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleProductChange = (e, productId, quantity) => {
        const { checked } = e.target;

        setSelectedProducts((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((product) => product.id === productId);

            // Pengecekan apakah checkbox sudah di centang dan quantity ditambahkan atau tidak
            if (checked) {
                // Kondisi ini berarti checkbox dicentang.
                // Jika produk belum ada di daftar, maka produk baru akan ditambahkan ke daftar updated
                if (index === -1) {
                    updated.push({ id: productId, quantity });
                } else {
                    // Namun jika sudah ada, hanya quantity saja yang diperbarui
                    updated[index].quantity = quantity;
                }
                // Kondisi ini belum dicentang
            } else {
                if (index !== -1) {
                    // Produk akan dihapus menggunakan splice dari daftar updated
                    updated.splice(index, 1);
                }
            }

            return updated;
        });
    };

    // Melakukan pengecekan jika quantity berubah
    const handleProductQuantityChange = (e, productId) => {
        const quantity = parseInt(e.target.value) || 1; // Mendapatkan nilai quantity baru

        // Memperbarui daftar
        setSelectedProducts((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((product) => product.id === productId);

            // Mencari produk di daftar
            if (index !== -1) {
                updated[index].quantity = quantity;
            }

            return updated;
        });
    };

    const handleBundleChange = (e, bundleId) => {
        const { checked } = e.target;
        const quantity = checked ? 1 : 0; // Menetapkan jumlah default menjadi 1 jika dicentang, 0 jika tidak dicentang.
    
        setSelectedBundles((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((bundle) => bundle.id === bundleId);
    
            if (checked) {
                if (index === -1) {
                    updated.push({ id: bundleId, quantity });
                } else {
                    updated[index].quantity = quantity; // Set quantity ke 1 ketika dicentang
                }
            } else {
                if (index !== -1) {
                    updated.splice(index, 1); // Menghapus bundle jika tidak dicentang
                }
            }
    
            return updated;
        });
    };
    
    const handleBundleQuantityChange = (e, bundleId) => {
        const quantity = parseInt(e.target.value) || 1; // Mengambil nilai quantity baru dari input
    
        setSelectedBundles((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((bundle) => bundle.id === bundleId);
    
            if (index !== -1) {
                updated[index].quantity = quantity; // Memperbarui quantity bundle sesuai input pengguna
            }
    
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Menangani terjadinya submit data dalam bentuk default dan menggunakan logika custom

        if (selectedProducts.length === 0 && selectedBundles.length === 0) {
            setAlertMessage("No products or bundles selected for purchase.");
            setAlertType("danger");
            return;
        }

        try {
            const response = await purchaseItems({ products: selectedProducts, bundles: selectedBundles });

            if (response.status === 200) {
                setAlertMessage(`Purchase successful! Total cost: Rp.${response.data.totalCost}`);
                setAlertType("success");
                toast.success(`Purchase successful! Total cost: Rp.${response.data.totalCost}`);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error || "An error occured";
                setAlertMessage(`Failed to process purchase: ${errorMessage}`);
                setAlertType("danger");
            } else {
                setAlertMessage("Failed to process purchase");
                setAlertType("danger");
            }
            toast.error("Failed to process purchase");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-50 mx-auto mt-4">
            <h2>Purchase</h2>

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
                            onChange={(e) => handleProductChange(e, product.id, 1)}
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
                            onChange={(e) => handleProductQuantityChange(e, product.id)}
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
                            onChange={(e) => handleBundleChange(e, bundle.id)}
                        />
                        <label className="form-check-label" htmlFor={`bundle-${bundle.id}`}>
                            {bundle.name} - Rp.{bundle.price} (Stock: {bundle.stock})
                        </label>
                        <input
                            type="number"
                            className="form-control mt-2"
                            value={selectedBundles.find((b) => b.id === bundle.id)?.quantity || 1}
                            onChange={(e) => handleBundleQuantityChange(e, bundle.id)}
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
