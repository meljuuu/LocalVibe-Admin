import { updateUser } from "@/app/lib/actions";
import { fetchUser } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";
import { decryptData } from "@/app/utils/encryption";

const SingleUserPage = async ({ params }) => {
    const { id } = params;
    const user = await fetchUser(id);

    const decryptedEmail = decryptData(user.email);

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.imgContainer}>
                    <Image src={user.img || "/noavatar.png"} alt="" fill />
                </div>
                {user.name}
            </div>
            <div className={styles.formContainer}>
                <form action={updateUser} className={styles.form}>
                    <input type="hidden" name="id" value={user.id} />
                    <label>Username</label>
                    <input type="text" name="username" placeholder={user.userName} />
                    <label>Email</label>
                    <input type="email" name="email" placeholder={decryptedEmail} />
                    <label>Password</label>
                    <input type="password" name="password" />
                    <label>Name</label>
                    <input type="text" name="name" placeholder={user.name} />
                    <label>Account type</label>
                    <textarea type="text" name="acctype" placeholder={user.accountType} />
                    <button>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleUserPage;