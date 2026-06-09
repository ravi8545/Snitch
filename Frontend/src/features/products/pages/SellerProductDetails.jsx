import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useProduct } from '../hook/useProduct';



const SellerProductDetails = () => {
    const [product, setProduct] = useState(null);
    const { productId } = useParams();
    const { handleGetProductById } = useProduct();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    console.log("Seller Product Details:", product);

    return (
        <div>Seller Product Details</div>
    )

}

export default SellerProductDetails;