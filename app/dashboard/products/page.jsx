import Link from "next/link";
import styles from "../../ui/dashboard/products/products.module.css";
import Search from "../../ui/dashboard/search/search";
import Pagination from "../../ui/dashboard/pagination/pagination";
import { fetchReports, fetchUser } from "../../lib/data";
import DeleteButton from "./deleteButton";

const Productspage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, reports } = await fetchReports(q, page);

  const userPromises = reports.map((report) => fetchUser(report.userId));
  const users = await Promise.all(userPromises);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search Product..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton} disabled>
            Add New
          </button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Reported At</td>
            <td>Report Count</td>
            <td>User</td>
            <td>Reason</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report.id}>
              <td>
                <div className={styles.product}>
                  {report.reportDate?.toString().slice(4, 16)}
                </div>
              </td>
              <td>{report.reportCount}</td>
              <td>{users[index]?.name}</td>
              <td>{report.reason}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/products/${report.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <DeleteButton
                    reportId={report.id}
                    reportedItemId={report.reportedItemId}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default Productspage;
