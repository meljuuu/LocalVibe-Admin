import { fetchUser } from "../../../lib/data";
import { decryptData } from "../../../utils/encryption";
import UserForm from "./UserForm"; // Import the form component
import styles from "../../../ui/dashboard/users/singleUser/singleUser.module.css";
import Image from 'next/image';
// Server-side fetching directly within the component
const SingleUserPage = async ({ params }) => {
    const { id } = params;
    const user = await fetchUser(id); // Fetch user data server-side
    console.log(user.avatar.url || "/noavatar.png"); // Log the image URL

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.imgContainer}>
                    <Image
                        src={user.avatar.url || "/noavatar.png"}
                        alt="User Avatar"
                        width={300}  // Set a fixed width for the image
                        height={300} // Set a fixed height for the image
                    />                </div>
                {user.name}
            </div>

            <UserForm user={user} /> {/* Pass user data to the form component */}
        </div>
    );
};

export default SingleUserPage;
