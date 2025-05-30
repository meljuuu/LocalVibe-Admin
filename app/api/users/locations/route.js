import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils";
import { User } from "../../../lib/models";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const region = searchParams.get("region");
    const city = searchParams.get("city");

    console.log("API Request Parameters:", {
      page,
      limit,
      region,
      city
    });

    await connectToDB();
    console.log("Database connected successfully");

    // Get all users first
    const allUsers = await User.find()
      .sort({ createdAt: -1 });

    // Process users to add default values and filter
    const processedUsers = allUsers
      .map(user => {
        const userObj = user.toObject();
        if (!userObj.address) {
          userObj.address = {};
        }
        // Set default values for region and city
        userObj.address.region = userObj.address.region || userObj.region || 'III';
        userObj.address.city = userObj.address.city || userObj.city || 'Olongapo';
        return userObj;
      })
      .filter(user => {
        if (region && user.address.region !== region) return false;
        if (city && user.address.city !== city) return false;
        return true;
      });

    // Get total count after filtering
    const count = processedUsers.length;
    console.log("Total users found:", count);

    // Apply pagination
    const paginatedUsers = processedUsers.slice(
      (page - 1) * limit,
      page * limit
    );

    console.log("Users found:", paginatedUsers.map(user => ({
      id: user._id,
      name: user.name,
      region: user.address.region,
      city: user.address.city,
      email: user.email
    })));

    return NextResponse.json({
      users: paginatedUsers,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 