"use client";

import { useState } from "react";
import { updateUser } from "../../../lib/actions";
import styles from "../../../ui/dashboard/users/singleUser/singleUser.module.css";

const UserForm = ({ user }) => {
    const [formData, setFormData] = useState({
        id: user._id || '',
        username: user.userName || '',
        email: user.email || '',
        password: '',
        name: user.name || '',
        acctype: user.accountType || '',
    });

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
            await updateUser(formDataObj);
        } catch (error) {
            console.error(error);
        }
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
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
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
        </div>
    );
};

export default UserForm;