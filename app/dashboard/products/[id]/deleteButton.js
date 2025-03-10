"use client";  // Mark as a Client Component

import { useState } from "react";
import { deleteReport } from "../../../lib/actions";

const DeleteButton = ({ reportId, reportedItemId }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (event) => {
        event.preventDefault();  // Prevent form submission from refreshing the page
        const confirmed = window.confirm("Are you sure you want to delete this report?");
        if (confirmed) {
            setLoading(true);
            const formData = new FormData();
            formData.append("id", reportId);
            formData.append("reportedItemId", reportedItemId);
            await deleteReport(formData);
            setLoading(false);
            alert("Report deleted successfully!");
            // Optionally, navigate away or update UI here
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            style={{
                backgroundColor: "crimson",
                padding: "10px",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            {loading ? "Deleting..." : "Delete Report"}
        </button>
    );
};

export default DeleteButton;
