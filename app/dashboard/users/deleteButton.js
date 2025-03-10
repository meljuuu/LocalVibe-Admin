"use client";

import { useState } from "react";
import { deleteUser } from "../../lib/actions";
import styles from "../../ui/dashboard/users/users.module.css";
import { useRouter } from "next/navigation";

const DeleteButton = ({ userId }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            setLoading(true);
            try {
                await deleteUser({ id: userId });
                router.refresh(); // Refresh the page to update the list
            } catch (error) {
                console.error("Error deleting user:", error);
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