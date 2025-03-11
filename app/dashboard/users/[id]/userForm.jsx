"use client";

import { useState } from "react";
import { updateUser } from "../../../lib/actions";
import styles from "../../../ui/dashboard/users/singleUser/singleUser.module.css";
import Modal from "./modal"; // Import Modal component

const UserForm = ({ user }) => {
    const [formData, setFormData] = useState({
        id: user._id || '',
        username: user.userName || '',
        email: user.email || '',
        password: '',
        name: user.name || '',
        acctype: user.accountType || '',
    });

    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [modalMessage, setModalMessage] = useState(""); // State to store the modal message

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });

            // Call updateUser and handle the response
            const result = await updateUser(formDataObj);

            if (result.success) {
                setShowModal(true);
                setModalMessage("Update Successful!"); // Set a success message for the modal
            } else {
                setShowModal(true);
                setModalMessage("Update Failed!");
            }

        } catch (error) {
            console.error(error);
            setShowModal(true);
            setModalMessage("An error occurred during the update.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide modal
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleUpdate} className={styles.form}>
                <input type="hidden" name="id" value={user.id} />
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <label>Account type</label>
                <textarea
                    name="acctype"
                    value={formData.acctype}
                    onChange={handleChange}
                />
                <button type="submit">Update</button>
            </form>

            {/* Show modal on successful or failed update */}
            {showModal && (
                <Modal onClose={handleCloseModal}>
                    <h2>{modalMessage}</h2> {/* Display message based on success or failure */}
                    <p>{modalMessage === "Update Successful!" ? "The user information has been updated successfully." : "There was an issue with updating the user."}</p>
                </Modal>
            )}
        </div>
    );
};

export default UserForm;
