import { User, Report, Admin, Pin } from "./models";
import { connectToDB } from "./utils";

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 7;

  try {
    await connectToDB();
    const count = await User.find({
      $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
    }).countDocuments();

    const users = await User.find({
      $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
    })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchReports = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();
    const count = await Report.find({
      $or: [
        { itemType: { $regex: regex } },
        { reason: { $regex: regex } },
        { content: { $regex: regex } },
      ],
    }).countDocuments();

    const reports = await Report.find({
      $or: [
        { itemType: { $regex: regex } },
        { reason: { $regex: regex } },
        { content: { $regex: regex } },
      ],
    })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));

    return { count, reports };
  } catch (err) {
    console.log("Error fetching reports:", err);
    throw new Error("Failed to fetch reports!");
  }
};

export const fetchUser = async (id) => {
  try {
    await connectToDB();
    const user = await User.findById(id);
    console.log(user); // Log user data to see if it contains the 'name' field
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const fetchTotalUsers = async () => {
  try {
    await connectToDB();
    const totalAccounts = await User.countDocuments(); // Get total count
    return totalAccounts;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch total users!");
  }
};

export const fetchReport = async (id) => {
  try {
    await connectToDB();
    const report = await Report.findById(id);
    return report;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Report!");
  }
};

export const fetchAdmins = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 2;

  try {
    await connectToDB();
    const count = await Admin.find({
      username: { $regex: regex },
    }).countDocuments();
    const admins = await Admin.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, admins };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch admins!");
  }
};

export const fetchAdmin = async (id) => {
  console.log(id);
  try {
    await connectToDB();
    const admin = await Admin.findById(id);
    return admin;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch admin!");
  }
};

export const fetchPins = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();
    const count = await Pin.find({
      $or: [
        { businessName: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    }).countDocuments();

    const pins = await Pin.find({
      $or: [
        { businessName: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    })
      .populate("createdBy", "name userName avatar")
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));

    return { count, pins };
  } catch (err) {
    console.log("Error fetching pins:", err);
    throw new Error("Failed to fetch pins!");
  }
};

export const fetchPin = async (id) => {
  try {
    await connectToDB();
    const pin = await Pin.findById(id)
      .populate("createdBy", "name userName avatar")
      .populate("reviews.userId", "name userName avatar");
    return pin;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch pin!");
  }
};

export const fetchTotalPins = async () => {
  try {
    await connectToDB();
    const totalPins = await Pin.countDocuments();
    return totalPins;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch total pins!");
  }
};

export const fetchPinsByUser = async (userId) => {
  try {
    console.log("Attempting to fetch pins for user ID:", userId);

    if (!userId) {
      console.error("No user ID provided");
      return [];
    }

    const response = await fetch(`/api/pins/user/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pins = await response.json();
    console.log("Found pins:", pins);
    return pins;
  } catch (err) {
    console.error("Error in fetchPinsByUser:", err);
    return [];
  }
};
