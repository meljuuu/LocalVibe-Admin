import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/mongoose";
import { Pin } from "../../lib/models";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("API Route - Received request for userId:", userId);
    console.log("API Route - UserId type:", typeof userId);

    await connectToDB();
    console.log("API Route - Database connected");

    if (userId) {
      console.log("API Route - Fetching pins for user:", userId);
      // Fetch pins for specific user
      const pins = await Pin.find({ createdBy: userId })
        .populate("createdBy", "name userName avatar")
        .sort({ createdAt: -1 });
      console.log("API Route - Found pins:", pins.length);
      return NextResponse.json(pins);
    }

    // Get current date and last week's date
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total count (all time)
    const totalCount = await Pin.countDocuments();

    // Get count for last week
    const weeklyCount = await Pin.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    // Get count for previous week
    const twoWeeksAgo = new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekCount = await Pin.countDocuments({
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

    return NextResponse.json({
      totalCount,
      weeklyCount,
      percentageChange,
    });
  } catch (error) {
    console.error("Error in pins route:", error);
    return NextResponse.json(
      { error: "Failed to fetch pins" },
      { status: 500 }
    );
  }
}
