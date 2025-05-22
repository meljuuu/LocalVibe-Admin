"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./userMap.module.css";

console.log("UserMap component is being loaded"); // Debug log at module level

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading map...</div>,
});

const UserMap = () => {
  console.log("UserMap component rendering"); // Debug log for component render
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUsers = async () => {
      try {
        console.log("Fetching users..."); // Debug log
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched users:", data.users); // Debug log

        const usersWithLocation = data.users.filter(
          (user) => user.latitude && user.longitude
        );
        console.log("Users with location:", usersWithLocation); // Debug log

        setUsers(usersWithLocation);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isMounted]);

  // Philippines center coordinates
  const center = { lat: 12.8797, lng: 121.774 };

  console.log("UserMap render state:", {
    loading,
    error,
    usersCount: users.length,
  }); // Debug log for render state

  if (!isMounted) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>User Locations</h2>
        <div className={styles.error}>
          No users with location data found. Please ensure users have latitude
          and longitude coordinates.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Locations</h2>
      <div className={styles.mapContainer}>
        {typeof window !== "undefined" && (
          <>
            {console.log("Rendering Map component")}
            <Map users={users} center={center} />
          </>
        )}
      </div>
    </div>
  );
};

export default UserMap;
