import React, { useEffect, useState } from "react";
import { fetchBundles } from "../services/api";
import { Link } from "react-router-dom";

const BundleList = () => {
    const [bundles, setBundles] = useState([]);

    useEffect(() => {
        fetchBundles().then((response) => {
            setBundles(response.data);
        }).catch((error) => {
            console.error("Error fetching bundles", error);
        });
    }, []);

    return (
        <div>
            <h2 className="mb-4">Bundle List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bundles.map((bundle) => (
                        <tr key={bundle.id}>
                            <td>{bundle.name}</td>
                            <td>{bundle.price}</td>
                            <td>{bundle.stock}</td>
                            <td>
                                <Link to={`/edit-bundle/${bundle.id}`} className="btn btn-warning">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BundleList;