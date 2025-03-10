"use client";

import { useState } from "react";
import { deleteReport } from "../../lib/actions";
import styles from "../../ui/dashboard/products/products.module.css";
import Modal from "./modal";
import { useRouter } from "next/navigation";

const DeleteButton = ({ reportId, reportedItemId }) => {
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this report?");
        if (confirmed) {
            setLoading(true);
            try {
                const result = await deleteReport({ id: reportId, reportedItemId });
                if (result.success) {
                    setShowSuccessModal(true);
                }
            } catch (error) {
                console.error("Error deleting report:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        router.refresh(); // Refresh the page to update the list
    };

    return (
        <>
            <button
                className={`${styles.button} ${styles.delete}`}
                onClick={handleDelete}
                disabled={loading}
            >
                {loading ? "Deleting..." : "Delete"}
            </button>

            {showSuccessModal && (
                <Modal onClose={handleModalClose}>
                    <h3>Success!</h3>
                    <p>Report deleted successfully.</p>
                </Modal>
            )}
        </>
    );
};

export default DeleteButton;