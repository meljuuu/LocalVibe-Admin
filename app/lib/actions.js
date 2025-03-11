"use server";

import { revalidatePath } from "next/cache";
import { User } from "./models";
import { Report } from "./models";
import { Admin } from "./models";
import { connectToDB } from "./utils";
import { permanentRedirect } from "next/navigation";
import bcrypt from "bcrypt";
import { Post } from "./models";

export const addUser = async (formData)=>{
    const {userName, email, password, name, accountType} =
    Object.fromEntries(formData);

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            userName,
            name, 
            email, 
            password:hashedPassword,  
            accountType, 
        });

        
    await newUser.save(); 
    }catch(err){
        console.log(err)
        throw new Error("failed to create user!");
    }

    revalidatePath("/dashboard/users")
    permanentRedirect("/dashboard/users")
}

export const deleteUser = async (formData) => {
    let formEntries;

    // Check if formData is an instance of FormData
    if (formData instanceof FormData) {
        // If formData is FormData, use Object.fromEntries to convert to an object
        formEntries = Object.fromEntries(formData.entries());
    } else {
        // If formData is already an object, use it directly
        formEntries = formData;
    }

    const { id } = formEntries;
    console.log(`Attempting to delete user with ID: ${id}`);

    try {
        await connectToDB();
        console.log("Database connection established.");

        // Proceed with deletion logic
        const result = await User.findByIdAndDelete(id);
        if (result) {
            console.log(`User with ID: ${id} deleted successfully.`);
        } else {
            console.log(`No user found with ID: ${id}.`);
        }
    } catch (err) {
        console.log("Error occurred during deletion:", err);
        throw new Error("Failed to delete user!");
    }

    revalidatePath("/dashboard/users");
    permanentRedirect("/dashboard/users");
};


export const updateUser = async (formData) => {
    const { id, userName, email, password, name, accountType } = Object.fromEntries(formData);

    console.log("Received formData:", formData);
    console.log("Extracted fields:", { id, userName, email, password, name, accountType });

    try {
        if (!id || id.trim() === "") {
            console.error("Invalid ID:", id);
            throw new Error("Invalid user ID");
        }

        connectToDB();  // Ensure that DB connection is successfully established

        const updateFields = {
            userName,
            email,
            password,
            name,
            accountType,
        };

        Object.keys(updateFields).forEach(
            (key) => (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
        );

        console.log("Final update fields:", updateFields);

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        console.log("Updated User:", updatedUser);

        if (!updatedUser) {
            console.log("No user found with the provided ID or the update failed.");
            throw new Error("User not found or update failed.");
        }

        // You can return success and the updated user object
        return { success: true, updatedUser };

    } catch (err) {
        console.error("Error updating user:", err);
        throw new Error("Failed to update user! " + err.message);
    }
};




export const addAdmin = async (formData) => {
    const { username, email, password, isAdmin, isActive, phone, address } = Object.fromEntries(formData);

    try {
        await connectToDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
            isAdmin,
            isActive,
            phone,
            address,
        });

        await newAdmin.save();
    } catch (err) {
        console.log(err);
        throw new Error("failed to create admin!");
    }

    revalidatePath("/dashboard/admin")
    permanentRedirect("/dashboard/admin")
}

export const deleteAdmin = async (formData)=>{
    const { id } =
    Object.fromEntries(formData);

    try {
    connectToDB();
    await Admin.findByIdAndDelete(id); 
    }catch(err){
        console.log(err)
        throw new Error("failed to delete Admin!");

    }

    revalidatePath("/dashboard/admin")
    
}

export const updateAdmin = async (formData) => {
    const {id, username, email, password, isAdmin, isActive, phone, address } = 
    Object.fromEntries(formData);

    try {
        connectToDB();

        const updateFields = {
            username,
            email,
            password,
            isAdmin,
            isActive,
            phone,
            address,
        }
        Object.keys(updateFields).forEach(
            (key)=>
                (updateFields[key]==="" || undefined) && delete updateFields[key]
        );

        await User.findByIdAndUpdate(id, updateFields);

    }catch(err){
        console.log(err)
        throw new Error("failed to update user!");
    }

    revalidatePath("/dashboard/admin")
    permanentRedirect("/dashboard/admin")

}

export const deleteReport = async (formData) => {
    // Check if formData is a FormData object
    let formEntries;
    if (formData instanceof FormData) {
        // If formData is FormData, use Object.fromEntries
        formEntries = Object.fromEntries(formData.entries());
    } else {
        // If formData is already an object, directly use it
        formEntries = formData;
    }

    const { id, reportedItemId } = formEntries;
    console.log(`Attempting to delete report with ID: ${id} and reportedItemId: ${reportedItemId}`);

    try {
        await connectToDB();
        console.log("Database connection established.");

        // Delete the post if the reportedItemId matches
        const post = await Post.findById(reportedItemId);
        if (post) {
            console.log(`Post found with id: ${reportedItemId}. Deleting post.`);
            await Post.findByIdAndDelete(reportedItemId);
            console.log(`Post with id: ${reportedItemId} deleted successfully.`);
        } else {
            console.log(`No post found with id: ${reportedItemId}.`);
        }

        // Delete the report
        const result = await Report.findByIdAndDelete(id);
        if (result) {
            console.log(`Report with ID: ${id} deleted successfully.`);
        } else {
            console.log(`No report found with ID: ${id}.`);
        }

    } catch (err) {
        console.log("Error occurred during deletion:", err);
        throw new Error("Failed to delete report!");
    }

    revalidatePath("/dashboard/products");
    permanentRedirect("/dashboard/products");
};
