"use client";

import { useState } from "react";
import { deleteReport } from "../../lib/actions";
import styles from "../../ui/dashboard/products/products.module.css";
import { useRouter } from "next/navigation";

const DeleteButton = ({ reportId, reportedItemId }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this report?");
        if (confirmed) {
            setLoading(true);
            try {
                await deleteReport({ id: reportId, reportedItemId });
                router.refresh(); // Refresh the page to update the list
            } catch (error) {
                console.error("Error deleting report:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <button
            className={`${styles.button} ${styles.delete}`}
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
};

export default DeleteButton;