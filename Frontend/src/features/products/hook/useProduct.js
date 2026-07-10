import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product;
    }


    async function handleGetSellerProduct() {
        const data = await getSellerProduct();
        dispatch(setSellerProducts(data.products));
        return data.products;

    }

    async function handleGetAllProducts() {
        const data = await getAllProducts();
        dispatch(setProducts(data.products));
        return data.products;
    }

    async function handleGetProductById(id) {
        const data = await getProductById(id);
        return data.product;
    }






    async function handleAddProductVariant(productId, variantData) {
        const data = await addProductVariant(productId, variantData);
        return data;
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleAddProductVariant
    };


}