import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/utils";
import { Pin } from "../../../../lib/models";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("Fetching pins for user:", id);

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const pins = await Pin.find({ createdBy: id })
      .populate("createdBy", "name userName avatar")
      .sort({ createdAt: -1 });

    console.log("Found pins:", pins);
    return NextResponse.json(pins);
  } catch (error) {
    console.error("Error fetching pins:", error);
    return NextResponse.json(
      { error: "Failed to fetch pins" },
      { status: 500 }
    );
  }
}
