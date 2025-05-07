"use client";

import { useEffect, useState } from "react";
import styles from "./chart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/chart");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const chartData = await response.json();
        console.log("Received chart data:", chartData);

        if (!Array.isArray(chartData)) {
          throw new Error("Invalid data format received from server");
        }

        // Ensure we have data for all days
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const completeData = days.map((day) => {
          const dayData = chartData.find((d) => d.name === day) || {
            name: day,
            users: 0,
            reports: 0,
          };
          return {
            name: day,
            users: dayData.users || 0,
            reports: dayData.reports || 0,
          };
        });

        setData(completeData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Weekly Recap</h2>
        <div className={styles.loading}>Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Weekly Recap</h2>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" tick={{ fill: "var(--textSoft)" }} />
          <YAxis tick={{ fill: "var(--textSoft)" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "#151c2c",
              border: "none",
              color: "var(--text)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            name="New Users"
            stroke="#8884d8"
            strokeDasharray="5 5"
            dot={{ fill: "#8884d8" }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="reports"
            name="New Reports"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
            dot={{ fill: "#82ca9d" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
