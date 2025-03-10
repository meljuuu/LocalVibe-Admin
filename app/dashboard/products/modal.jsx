import styles from './modal.module.css';

export default function Modal({ children, onClose }) {
    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                {children}
                <button className={styles["close-button"]} onClick={onClose}>Close</button>
            </div>
        </div>
    );
}