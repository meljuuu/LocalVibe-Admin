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
  const accountType = searchParams?.accountType || "all";
  const ITEM_PER_PAGE = 10;
  const { count, users, totalPages, currentPage } = await fetchUsers(
    q,
    page,
    accountType
  );

  const getAccountTypeClass = (type) => {
    if (!type) return styles.other;
    return styles[type.toLowerCase()] || styles.other;
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.filterContainer}>
          <Search placeholder="Search user..." />
          <div className={styles.accountTypeFilters}>
            <Link href={`/dashboard/users?accountType=all`}>
              <button
                className={`${styles.filterButton} ${
                  accountType === "all" ? styles.active : ""
                }`}
              >
                All
              </button>
            </Link>
            <Link href={`/dashboard/users?accountType=personal`}>
              <button
                className={`${styles.filterButton} ${
                  accountType === "personal" ? styles.active : ""
                }`}
              >
                Personal
              </button>
            </Link>
            <Link href={`/dashboard/users?accountType=business`}>
              <button
                className={`${styles.filterButton} ${
                  accountType === "business" ? styles.active : ""
                }`}
              >
                Business
              </button>
            </Link>
          </div>
        </div>
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
            <td>Account Type</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const decryptedEmail = decryptData(user.email);
            const userData = {
              ...user.toObject(),
              _id: user._id.toString(),
            };
            return (
              <tr key={userData._id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={userData.avatar?.url || "/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {userData.name}
                  </div>
                </td>
                <td>{decryptedEmail}</td>
                <td>{userData.createdAt?.toString().slice(4, 16)}</td>
                <td>
                  <span
                    className={`${
                      styles.accountTypeBadge
                    } ${getAccountTypeClass(userData.accountType)}`}
                  >
                    {userData.accountType || "N/A"}
                  </span>
                </td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/users/${userData._id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View
                      </button>
                    </Link>
                    <DeleteButton userId={userData._id} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.paginationInfo}>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <span>
          Showing {Math.min(currentPage * ITEM_PER_PAGE, count)} of {count}{" "}
          users
        </span>
      </div>
      <Pagination count={count} />
    </div>
  );
};

export default Userspage;
