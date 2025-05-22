"use client"; // 👈 Needed to use useEffect and useState

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./transactions.module.css";
import { decryptData } from "../../../utils/encryption"; // Import the decrypt function

const Transactions = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLatestUsers = async () => {
      try {
        const response = await fetch("/api/users"); // Remove the limit parameter
        const data = await response.json();
        setUsers((data.users || []).slice(0, 5)); // Slice to get only first 5 users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchLatestUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Users</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => {
              const decryptedEmail = decryptData(user.email); // Decrypt email before rendering

              return (
                <tr key={index}>
                  <td>
                    <div className={styles.user}>
                      <Image
                        src={user.profileImage || "/noavatar.png"} // Use user image if available
                        alt={user.username}
                        width={40}
                        height={40}
                        className={styles.userImage}
                      />
                      {user.username}
                    </div>
                  </td>
                  <td>
                    {decryptedEmail} {/* Display decrypted email */}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className={styles.empty}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
