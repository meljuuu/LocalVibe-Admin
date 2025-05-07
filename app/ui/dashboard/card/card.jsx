"use client"; // ✅ Add this to ensure it runs on the client side

import { useEffect, useState } from "react";
import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const Card = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [usersPercentage, setUsersPercentage] = useState(0);
  const [reportsPercentage, setReportsPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch users count
        const usersRes = await fetch("/api/accounts");
        if (!usersRes.ok) throw new Error("Failed to fetch users data");
        const usersData = await usersRes.json();
        setTotalUsers(usersData.totalAccounts);
        setUsersPercentage(usersData.percentageChange);

        // Fetch reports count
        const reportsRes = await fetch("/api/reports");
        if (!reportsRes.ok) throw new Error("Failed to fetch reports data");
        const reportsData = await reportsRes.json();
        setTotalReports(reportsData.count);
        setReportsPercentage(reportsData.percentageChange);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.texts}>
            <span className={styles.title}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <MdSupervisedUserCircle size={24} />
        <div className={styles.texts}>
          <span className={styles.title}>Total Users</span>
          <span className={styles.number}>{totalUsers}</span>{" "}
          {/* ✅ Display actual count */}
          <span className={styles.detail}>
            <span
              className={
                usersPercentage >= 0 ? styles.positive : styles.negative
              }
            >
              {usersPercentage}%
            </span>{" "}
            {usersPercentage >= 0 ? "more" : "less"} than last week
          </span>
        </div>
      </div>

      <div className={styles.container}>
        <MdSupervisedUserCircle size={24} />
        <div className={styles.texts}>
          <span className={styles.title}>Total Reports</span>
          <span className={styles.number}>{totalReports}</span>{" "}
          {/* ✅ Display actual count */}
          <span className={styles.detail}>
            <span
              className={
                reportsPercentage >= 0 ? styles.positive : styles.negative
              }
            >
              {reportsPercentage}%
            </span>{" "}
            {reportsPercentage >= 0 ? "more" : "less"} than last week
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
