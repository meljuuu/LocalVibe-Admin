import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/utils";
import { Report } from "../../lib/models";

export async function GET() {
  try {
    await connectToDB();

    // Get current date and last week's date
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total count
    const totalCount = await Report.countDocuments();

    // Get last week's count
    const lastWeekCount = await Report.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    // Calculate percentage change
    const percentageChange =
      lastWeekCount === 0
        ? 100
        : Math.round(((totalCount - lastWeekCount) / lastWeekCount) * 100);

    return NextResponse.json(
      {
        count: totalCount,
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
