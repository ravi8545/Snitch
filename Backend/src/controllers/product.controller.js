import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import mongoose from "mongoose";


export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;

    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        images,
        seller: seller._id
    })

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    })



}


export async function getSellerProducts(req, res) {
    const seller = req.user;
    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        success: true,
        message: "Seller products fetched successfully",
        products
    });
}


export async function getAllProducts(req, res) {
    const products = await productModel.find({});

    res.status(200).json({
        success: true,
        message: "All products fetched successfully",
        products
    });
}



// export async function getProductDetails(req, res) {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Product ID"
//             });
//         }

//         const product = await productModel.findById(id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Product details fetched successfully",
//             product
//         });

//     } catch (error) {
//         console.error("Get Product Error:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }



export async function getProductDetails(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    res.status(200).json({
        success: true,
        message: "Product details fetched successfully",
        product
    })
}


