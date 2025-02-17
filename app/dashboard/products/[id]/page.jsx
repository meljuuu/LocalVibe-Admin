import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";
import { fetchReport } from "@/app/lib/data";

const SingleProductPage = async ({ params }) => {
    const { id } = params;
    const report = await fetchReport(id);

    if (!report) {
        console.error('Report not found');
        return <div>Report not found</div>;
    }

    console.log('Fetched Report:', report.reportTitle);

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action="" className={styles.form}>
                    <input type="hidden" name="id" value={report._id} />
                    <label>User ID</label>
                    <input type="text" name="userId" placeholder={report.userId.toString()} />
                    <label>Reported Item ID</label>
                    <input type="number" name="reportedItemId" placeholder={report.reportedItemId.toString()} />
                    <label>Report Count</label>
                    <input type="number" name="stock" placeholder={report.reportCount.toString()} />
                    <label>Reason</label>
                    <input type="text" name="reason" placeholder={report.reason} />
                    <label>Type</label>
                    <input type="text" name="itemType" placeholder={report.itemType} />
                    <label>Report Date</label>
                    <textarea name="size" placeholder={report.reportDate?.toString().slice(4, 16)} />
                    <label>Report Title</label>
                    <input type="text" name="reportTitle" placeholder={report.reportTitle} />
                    <button>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleProductPage;
