const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


const handleImageUpload = async (req, res)=> {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        res.json({
            success: "true",
            result
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:'false',
            message: 'Error Occured',
        });
        
    }
}

//add a product
const addProduct = async (req, res)=>{
    try {
        const {image,title,description,category,brand,price,salePrice,totalStock} = req.body;
        const newlyCreatedProduced = new Product({
            image,title,description,category,brand,price,salePrice,totalStock
        });
        await newlyCreatedProduced.save();

        res.status(201).json({
            success: "true",
            data : newlyCreatedProduced
        });
    } catch (error) {
        console.log(error);
        res.json({
            success:'false',
            message: 'Error Occured',
        });
        
    }
}
//delete a product
const deleteProduct = async (req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product)
            return res.status(404).json({
            success:'false',
            message: 'product not found',
        });

        res.status(201).json({
            success: "true",
            message : "product deleted",
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:'false',
            message: 'Error Occured',
        });
        
    }
}
//edit a product
const editProduct = async (req, res)=>{
    try {
        const {id} = req.params;
        const {image,title,description,category,brand,price,salePrice,totalStock} = req.body;
        const findProduct = await Product.findById(id);

        if(!findProduct)
            return res.status(404).json({
            success:'false',
            message: 'product not found',
        });
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;

        await findProduct.save();

        res.status(201).json({
            success: "true",
            data : findProduct,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:'false',
            message: 'Error Occured',
        });
        
    }
}
//fetch a product
const fetchAllProducts = async (req, res)=>{
    try {
        const listOfProduct = await Product.find({});
        res.status(200).json({
            success: "true",
            data: listOfProduct,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:'false',
            message: 'Error Occured',
        });
        
    }
}
module.exports = {handleImageUpload, addProduct, fetchAllProducts,editProduct,deleteProduct};