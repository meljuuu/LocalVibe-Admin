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

export const deleteUser = async (formData)=>{
    const { id } =
    Object.fromEntries(formData);

    try {
    connectToDB();
    await User.findByIdAndDelete(id); 
    }catch(err){
        console.log(err)
        throw new Error("failed to delete user!");
    }

    revalidatePath("/dashboard/users")
    
}

export const updateUser = async (formData) => {
    const { id, userName, email, password, name, accountType } =
        Object.fromEntries(formData);

    // Log the form data to ensure we're getting the correct fields
    console.log("Received formData:", formData);
    console.log("Extracted fields:", { id, userName, email, password, name, accountType });

    try {
        // Log the value of 'id' before attempting the database operation
        if (!id || id.trim() === "") {
            console.error("Invalid ID:", id);  // Log if the id is invalid
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

        // Remove empty or undefined fields
        Object.keys(updateFields).forEach(
            (key) =>
                (updateFields[key] === "" || updateFields[key] === undefined) &&
                delete updateFields[key]
        );

        // Log the final fields that will be updated
        console.log("Final update fields:", updateFields);

        // Perform the update in the database
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        // Log the result of the update operation
        console.log("Updated User:", updatedUser);

        // Ensure the update was successful
        if (!updatedUser) {
            console.log("No user found with the provided ID or the update failed.");
            throw new Error("User not found or update failed.");
        }

        // Revalidate the path (if applicable)
        revalidatePath("/dashboard/users");

        return { success: true };
    } catch (err) {
        // Log the actual error for debugging
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
