import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/utils";
import { User, Report } from "../../lib/models";

export async function GET() {
  try {
    // Connect to database
    await connectToDB();
    console.log("Database connected successfully");

    // Get dates for the last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // Format dates for MongoDB query
    const startDate = new Date(dates[0]);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    console.log("Query date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Get users data with error handling
    let usersData = [];
    try {
      usersData = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      console.log("Users aggregation successful:", usersData);
    } catch (userError) {
      console.error("Error in users aggregation:", userError);
      usersData = [];
    }

    // Get reports data with error handling
    let reportsData = [];
    try {
      reportsData = await Report.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      console.log("Reports aggregation successful:", reportsData);
    } catch (reportError) {
      console.error("Error in reports aggregation:", reportError);
      reportsData = [];
    }

    // Format data for the chart
    const chartData = dates.map((date) => {
      const dateStr = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const usersCount = usersData.find((d) => d._id === dateStr)?.count || 0;
      const reportsCount =
        reportsData.find((d) => d._id === dateStr)?.count || 0;

      return {
        name: dayName,
        users: usersCount,
        reports: reportsCount,
      };
    });

    console.log("Final chart data:", chartData);

    // Ensure we always return an array, even if empty
    return NextResponse.json(chartData || [], { status: 200 });
  } catch (error) {
    console.error("Error in chart API:", error);
    // Return empty array instead of error to prevent frontend crash
    return NextResponse.json([], { status: 200 });
  }
}
