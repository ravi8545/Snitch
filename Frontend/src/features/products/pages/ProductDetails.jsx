import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useState } from "react";


const ProductDetails = () => {
    const { productId } = useParams();
    console.log("productId", productId);
    const [product, setProduct] = useState(null);
    const { handleGetProductById } = useProduct();


    async function fetchProductDetails() {
        const data = await handleGetProductById(productId);
        setProduct(data);
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);


    console.log("product", product);
    return (
        <div>
            <h1>Product Details Page</h1>
        </div>

    );
}

export default ProductDetails;
