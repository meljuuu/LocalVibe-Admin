import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/utils";
import { Pin } from "../../../../lib/models";

export async function PUT(request, { params }) {
  try {
    const { pinId } = params;

    if (!pinId) {
      return NextResponse.json(
        { error: "Pin ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const updatedPin = await Pin.findByIdAndUpdate(
      pinId,
      { approved: true },
      { new: true }
    );

    if (!updatedPin) {
      return NextResponse.json({ error: "Pin not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPin, { status: 200 });
  } catch (error) {
    console.error("Error approving pin:", error);
    return NextResponse.json(
      { error: "Failed to approve pin" },
      { status: 500 }
    );
  }
}
