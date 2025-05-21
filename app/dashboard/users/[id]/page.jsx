import { fetchUser } from "../../../lib/data";
import UserForm from "./userForm";
import styles from "../../../ui/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";

const SingleUserPage = async ({ params }) => {
  const { id } = params;
  const user = await fetchUser(id);

  if (!user) {
    return <div>User not found</div>;
  }

  // Convert MongoDB document to plain object and ensure _id is a string
  const userData = {
    ...user.toObject(),
    _id: user._id.toString(),
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={userData.avatar?.url || "/noavatar.png"}
            alt="User Avatar"
            width={300}
            height={300}
          />
        </div>
        {userData.name}
      </div>

      <UserForm user={userData} />
    </div>
  );
};

export default SingleUserPage;
