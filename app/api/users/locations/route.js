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

    // Build the query to handle both old and new data structures with defaults
    const query = {
      $or: []
    };

    if (region) {
      query.$or.push(
        { "address.region": region },  // New structure
        { region: region },            // Old structure
        { 
          $and: [
            { "address.region": { $exists: false } },
            { region: { $exists: false } }
          ]
        }  // No region set (will use default)
      );
    }
    if (city) {
      query.$or.push(
        { "address.city": city },      // New structure
        { city: city },                // Old structure
        { 
          $and: [
            { "address.city": { $exists: false } },
            { city: { $exists: false } }
          ]
        }  // No city set (will use default)
      );
    }

    // If no filters are applied, remove the $or operator
    if (query.$or.length === 0) {
      delete query.$or;
    }

    console.log("MongoDB Query:", query);

    // Get total count
    const count = await User.countDocuments(query);
    console.log("Total users found:", count);

    // Get users with pagination
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Process users to add default values
    const processedUsers = users.map(user => {
      const userObj = user.toObject();
      if (!userObj.address) {
        userObj.address = {};
      }
      if (!userObj.address.region && !userObj.region) {
        userObj.address.region = 'III';
      }
      if (!userObj.address.city && !userObj.city) {
        userObj.address.city = 'Olongapo';
      }
      return userObj;
    });

    console.log("Users found:", processedUsers.map(user => ({
      id: user._id,
      name: user.name,
      region: user.address?.region || user.region || 'III',
      city: user.address?.city || user.city || 'Olongapo',
      email: user.email
    })));

    return NextResponse.json({
      users: processedUsers,
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