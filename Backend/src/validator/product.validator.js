import {body, validationResult} from "express-validator";

function validateRequest(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

export const createProductValidator = [
    body("title").notEmpty().withMessage("Title is required").isLength({min: 3}).withMessage("Title must be at least 3 characters long"),
    body("description").notEmpty().withMessage("Description is required").isLength({min: 10}).withMessage("Description must be at least 10 characters long"),
    body("priceAmount").notEmpty().withMessage("Price amount is required").isFloat({gt: 0}).withMessage("Price amount must be a positive number"),
    body("priceCurrency").notEmpty().withMessage("Price currency is required").isLength({min: 3, max: 3}).withMessage("Price currency must be a 3-letter ISO code"),
    validateRequest
]
