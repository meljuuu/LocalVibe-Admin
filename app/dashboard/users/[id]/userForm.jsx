"use client";

import { useState, useEffect } from "react";
import { updateUser } from "../../../lib/actions";
import { fetchPinsByUser } from "../../../lib/data";
import styles from "../../../ui/dashboard/users/singleUser/singleUser.module.css";
import Modal from "./modal";
import Image from "next/image";

const UserForm = ({ user }) => {
  const [formData, setFormData] = useState({
    id: user._id || "",
    username: user.userName || "",
    email: user.email || "",
    password: "",
    name: user.name || "",
    acctype: user.accountType || "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userPins, setUserPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPins = async () => {
      try {
        console.log("Loading pins for user:", user._id);
        const pins = await fetchPinsByUser(user._id);
        console.log("Loaded pins:", pins);
        setUserPins(pins);
      } catch (error) {
        console.error("Error loading pins:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user._id) {
      loadUserPins();
    } else {
      setLoading(false);
    }
  }, [user._id]);

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

      const result = await updateUser(formDataObj);
      setShowModal(true);
      setModalMessage(result.success ? "Update Successful!" : "Update Failed!");
    } catch (error) {
      console.error(error);
      setShowModal(true);
      setModalMessage("An error occurred during the update.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

      {/* User's Pins Section */}
      <div className={styles.pinsSection}>
        <div className={styles.sectionHeader}>
          <h2>Business Profile</h2>
          <p>View business details</p>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading business information...</p>
          </div>
        ) : userPins.length > 0 ? (
          <div className={styles.pinsGrid}>
            {userPins.map((pin) => (
              <div key={pin._id} className={styles.pinCard}>
                <div className={styles.pinHeader}>
                  <div className={styles.businessInfo}>
                    <h3>{pin.businessName}</h3>
                    <div className={styles.category}>
                      <span>{pin.category}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.imageContainer}>
                  {pin.image?.url && (
                    <div className={styles.businessImage}>
                      <Image
                        src={pin.image.url}
                        alt={pin.businessName}
                        width={400}
                        height={300}
                        className={styles.pinImage}
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.imageLabel}>
                          Business Photo
                        </span>
                      </div>
                    </div>
                  )}

                  {pin.proofOfBusinessImage && (
                    <div className={styles.proofImage}>
                      <Image
                        src={pin.proofOfBusinessImage}
                        alt="Business Certificate"
                        width={400}
                        height={300}
                        className={styles.pinImage}
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.imageLabel}>
                          Business Certificate
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.pinDetails}>
                  <div className={styles.detailItem}>
                    <h4>About the Business</h4>
                    <p>{pin.description}</p>
                  </div>

                  {pin.address && (
                    <div className={styles.detailItem}>
                      <h4>Location</h4>
                      <p>{pin.address}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noPins}>
            <div className={styles.noPinsIcon}>📝</div>
            <p>No business profile found for this user.</p>
            <p className={styles.noPinsSubtext}>
              The user hasn&apos;t created any business listings yet.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h2>{modalMessage}</h2>
          <p>
            {modalMessage === "Update Successful!"
              ? "The user information has been updated successfully."
              : "There was an issue with updating the user."}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default UserForm;
