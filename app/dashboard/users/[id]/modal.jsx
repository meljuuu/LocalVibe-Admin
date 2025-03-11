import styles from './modal.module.css'; // Ensure this path is correct

export default function Modal({ children, onClose }) {
    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <h1>Updated successfully!</h1> {/* Add the success title */}
                {children} {/* Display any additional content passed to the modal */}
                <button className={styles["close-button"]} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
