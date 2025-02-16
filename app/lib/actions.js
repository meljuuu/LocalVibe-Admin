import { revalidatePath } from "next/cache";
import { User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/dist/server/api-utils";
import { permanentRedirect } from "next/navigation";
import bcrypt from "bcrypt";

export const addUser = async (formData)=>{
    "use server"
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
    "use server"
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
    "use server"
    const {id, userName, email, password, name, accountType} = 
    Object.fromEntries(formData);

    try {
        connectToDB();

        const updateFields = {
            userName,
            email,
            password,
            name,
            accountType,
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

    revalidatePath("/dashboard/users")
    permanentRedirect("/dashboard/users")

}

export const deleteReport = async (formData)=>{
    "use server"
    const { id } =
    Object.fromEntries(formData);

    try {
    connectToDB();
    await Report.findByIdAndDelete(id); 
    }catch(err){
        console.log(err)
        throw new Error("failed to delete Report!");
    }

    revalidatePath("/dashboard/products")
    
}