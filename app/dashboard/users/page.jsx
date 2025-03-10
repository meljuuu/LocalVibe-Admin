import Link from "next/link";
import styles from "../../ui/dashboard/users/users.module.css";
import Search from "../../ui/dashboard/search/search";
import Pagination from "../../ui/dashboard/pagination/pagination";
import { fetchUsers } from "../../lib/data";
import DeleteButton from "./deleteButton"; // Import the DeleteButton component
import Image from "next/image";
import { decryptData } from "../../utils/encryption";

const Userspage = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const { count, users } = await fetchUsers(q, page);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search user..." />
                <Link href="/dashboard/users/add">
                    <button className={styles.addButton}>Add Admin</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Created At</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const decryptedEmail = decryptData(user.email); // Decrypt the email here
                        return (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.user}>
                                        <Image
                                            src={user.avatar.url || "/noavatar.png"}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className={styles.userImage}
                                        />
                                        {user.name}
                                    </div>
                                </td>
                                <td>{decryptedEmail}</td> {/* Use the decrypted email */}
                                <td>{user.createdAt?.toString().slice(4, 16)}</td>
                                <td>{user.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                    <div className={styles.buttons}>
                                        <Link href={`/dashboard/users/${user.id}`}>
                                            <button className={`${styles.button} ${styles.view}`}>
                                                View
                                            </button>
                                        </Link>
                                        <DeleteButton userId={user.id} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination count={count} />
        </div>
    );
};

export default Userspage;
