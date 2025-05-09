import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/utils";
import { Report } from "../../lib/models";

export async function GET() {
  try {
    await connectToDB();

    // Get current date and last week's date
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total count (all time)
    const totalCount = await Report.countDocuments();

    // Get count for last week
    const weeklyCount = await Report.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    // Get count for previous week
    const twoWeeksAgo = new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekCount = await Report.countDocuments({
      createdAt: {
        $gte: twoWeeksAgo,
        $lt: lastWeek,
      },
    });

    // Calculate percentage change
    const percentageChange =
      previousWeekCount === 0
        ? 100
        : Math.round(
            ((weeklyCount - previousWeekCount) / previousWeekCount) * 100
          );

    return NextResponse.json(
      {
        totalCount,
        weeklyCount,
        percentageChange,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching total reports:", error);
    return NextResponse.json(
      { message: "Failed to fetch total reports" },
      { status: 500 }
    );
  }
}
