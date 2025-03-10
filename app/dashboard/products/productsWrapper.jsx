"use client";

import { useState } from "react";
import Productspage from "./page";
import Modal from "./modal";

const ProductsWrapper = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    return (
        <>
            <Productspage onDeleteSuccess={() => setShowSuccessModal(true)} />
            {showSuccessModal && (
                <Modal onClose={() => setShowSuccessModal(false)}>
                    <h3>Success!</h3>
                    <p>Report deleted successfully.</p>
                </Modal>
            )}
        </>
    );
};

export default ProductsWrapper;