import Image from "next/image"
import Link from "next/link"
import styles from "@/app/ui/dashboard/products/products.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import {searchParams} from "next/navigation"
import { fetchReports } from "@/app/lib/data";


const Productspage = async ({searchParams}) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1 ;
    const { count, reports } = await fetchReports(q, page);

    console.log(reports)

    return (
        <div className={styles.container}>
        <div className={styles.top}>
            <Search placeholder="Search Product..." />
            <Link href="/dashboard/products/add">
            <button className={styles.addButton} disabled>Add New</button>
            </Link>
        </div>
        <table className={styles.table}>
            <thead>
                <tr>
                    <td>Reported At</td>
                    <td>Report Count</td>
                    <td>Type</td> 
                    <td>Reason</td>
                    <td>Action</td>
                </tr>
            </thead>
            <tbody>
                {reports.map(report=>(
                <tr key={report.id}>
                    <td>
                        <div className={styles.product}>
                            
                        {report.reportDate?.toString().slice(4, 16)}
                        </div>
                    </td>
                    <td>{report.reportCount}</td>
                    <td>{report.itemType}</td>
                    <td>{report.reason}</td>
                    
                    <td>
                        <div className={styles.buttons}>
                            <Link href={`/dashboard/products/${report.id}`}>
                                <button className={`${styles.button} ${styles.view}`}>
                                    View
                                </button>
                            </Link>
                                <button className={`${styles.button} ${styles.delete}`}>
                                    Delete
                                </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        <Pagination count={count} />
    </div>
    )
}

export default Productspage