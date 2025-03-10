

import styles from "../../../ui/dashboard/products/singleProduct/singleProduct.module.css";
import { fetchReport } from "../../../lib/data";
import DeleteButton from "../DeleteButton";  // Import the DeleteButton component

const SingleProductPage = async ({ params }) => {
    const { id } = params;
    const report = await fetchReport(id); // Fetch specific report based on the ID

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form className={styles.form}>
                    <input type="hidden" name="id" value={report.id} />
                    <input type="hidden" name="reportedItemId" value={report.reportedItemId} />
                    <label>User ID</label>
                    <input type="text" name="reportUserId" placeholder={report.userId} />
                    <label>Reported Item ID</label>
                    <input type="number" name="reportReportedPostId" placeholder={report.reportedItemId} />
                    <label>Report Count</label>
                    <input type="number" name="reportReportCount" placeholder={report.reportCount} />
                    <label>Reason</label>
                    <input type="text" name="reportReason" placeholder={report.reason} />
                    <label>Type</label>
                    <input type="text" name="reportType" placeholder={report.itemType} />
                    <label>Report Date</label>
                    <textarea type="text" name="reportDate" placeholder={report.reportDate?.toString().slice(4, 16)} />
                    <label>Content</label>
                    <input name="desc" id="desc" rows="10" placeholder={report.reportTitle} />

                    {/* Delete Button */}
                    <DeleteButton reportId={report.id} reportedItemId={report.reportedItemId} />
                </form>
            </div>
        </div>
    );
};

export default SingleProductPage;
