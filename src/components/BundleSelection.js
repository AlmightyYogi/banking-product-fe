import React, { useEffect, useState } from "react";
import { fetchBundleByProductId, fetchProductById, purchaseItems } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BundleSelection = () => {
    const { productId } = useParams();
    const [bundleByProductId, setBundleByProductId] = useState([]);
    const [selectedBundles, setSelectedBundles] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [productName, setProductName] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [bundleResponse, productReponse] = await Promise.all([
                    fetchBundleByProductId(productId),
                    fetchProductById(productId),
                ]);

                if (isMounted) {
                    setBundleByProductId(bundleResponse.data);
                    setProductName(productReponse.data[0]?.name);
                    console.log("Response Bundles:", bundleResponse.data);
                    console.log("Response Product:", productReponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    const handleBundleSelection = (bundleId) => {
        setSelectedBundles((prev) => {
            const existingBundle = prev.find((b) => b.id === bundleId);
            if (existingBundle) {
                // Jika bundle sudah dipilih, hapus dari daftar
                return prev.filter((b) => b.id !== bundleId);
            } else {
                // Jika belum, tambahkan ke daftar dengan quantity default = 1
                return [...prev, { id: bundleId, quantity: 1 }];
            }
        });
    };

    const handleQuantityChange = (bundleId, quantity) => {
        setSelectedBundles((prev) =>
            prev.map((b) =>
                b.id === bundleId ? { ...b, quantity: parseInt(quantity, 10) || 1 } : b
            )
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(amount)
            .replace("Rp", "")
            .trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedBundles.length === 0) {
            setAlertMessage("No bundles selected for purchase.");
            setAlertType("danger");
            return;
        }

        try {
            const payload = {
                products: [
                    { id: productId, quantity: 1 },
                ],
                bundles: selectedBundles.map((b) => ({
                    id: b.id,
                    quantity: b.quantity,
                })),
            };

            console.log("Payload:", payload);

            const response = await purchaseItems(payload);

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
                const errorMessage = error.response.data.error || "An error occurred.";
                setAlertMessage(`Failed to process purchase: ${errorMessage}`);
                setAlertType("danger");
            } else {
                setAlertMessage("Failed to process purchase.");
                setAlertType("danger");
            }
            toast.error("Failed to process purchase.");
            console.error(error);
        }
    };

    const handleEditClick = (bundleId, e) => {
        e.stopPropagation(); // Menghentikan propagasi klik ke card bundle
        navigate(`/edit-bundle/${bundleId}`);
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <h2 className="mb-4">Select Bundles for Product {productName ? productName : "Loading..."}</h2>

            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                </div>
            )}

            <div className="row">
                {bundleByProductId.map((bundle) => {
                    const isSelected = selectedBundles.some((b) => b.id === bundle.id);
                    const selectedBundle = selectedBundles.find((b) => b.id === bundle.id);

                    return (
                        <div
                            key={bundle.id}
                            className={`col-md-4 mb-4 ${isSelected ? "border border-primary rounded" : ""}`}
                            onClick={() => handleBundleSelection(bundle.id)} // Pemilihan bundle hanya pada card (bukan tombol Edit)
                            style={{ cursor: "pointer" }}
                        >
                            <div className="card bundle-card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{bundle.name}</h5>
                                    <p className="card-text">
                                        <strong>Price:</strong> Rp.{formatCurrency(bundle.price)}
                                    </p>
                                    <p className="card-text">
                                        <strong>Stock:</strong> {bundle.stock}
                                    </p>
                                    <p className="card-text">
                                        <strong>Description:</strong>{" "}
                                        {bundle.description || "No description available."}
                                    </p>

                                    {isSelected && (
                                        <div className="mt-3">
                                            <label htmlFor={`quantity-${bundle.id}`}>
                                                <strong>Quantity:</strong>
                                            </label>
                                            <input
                                                id={`quantity-${bundle.id}`}
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                max={bundle.stock}
                                                value={selectedBundle?.quantity || 1}
                                                onChange={(e) =>
                                                    handleQuantityChange(bundle.id, e.target.value)
                                                }
                                                onClick={(e) => e.stopPropagation()} // Mencegah klik di input mengubah pilihan bundle
                                            />
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-warning mt-3"
                                        onClick={(e) => handleEditClick(bundle.id, e)} // Memastikan hanya tombol Edit yang mengarahkan ke halaman edit
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                type="submit"
                className="btn btn-primary w-100 mt-4"
                disabled={selectedBundles.length === 0}
            >
                Process Purchase
            </button>
        </form>
    );
};

export default BundleSelection;
