import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";
import { fetchReport } from "@/app/lib/data";


const SingleProductPage = async ({ params }) => {

     const { id } = params;
    const report = await fetchReport(id)
    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action="" className={styles.form}>
                <input type="hidden" name="id" value={report.id} />
                    <label>User ID</label>
                    <input type="text" name="userId" placeholder={report.userId}/>
                    <label>reportedItemId</label>
                    <input type="number" name="price" placeholder={report.reportedItemId}/>
                    <label>Report count</label>
                    <input type="number" name="stock" placeholder={report.reportCount}/>
                    <label>Reason</label>
                    <input type="text" name="reason" placeholder={report.reason}/>
                    <label>Type</label>
                    <input type="text" name="itemType" placeholder={report.itemType}/>
                    <label>Report Date</label>
                    <textarea type="text" name="size" placeholder={report.reportDate?.toString().slice(4, 16)}/>                   
                    <label>Report Title</label>
                    <input name="desc" id="desc" rows="10" placeholder={report.reportTitle}/>

                    <button>Update</button>
                </form>
            </div>
        </div>
    )
}

export default SingleProductPage
