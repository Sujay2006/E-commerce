const Product = require("../../models/Product");

const getFilteredProducts = async (req, res)=>{
    try {

        const {category = [],brand=[], sortBy = "price-hightolow"} = req.query;

        let filter = {};

        if(category.length){
            filter.category = {$in : category.split(',')}
        }
        if(brand.length){
            filter.brand = {$in : brand.split(',')}
        }
        

        let sort = {}

        switch(sortBy){
            case 'price-hightolow':
                sort.price = -1

                break;
            case 'price-lowtohigh':
                sort.price = 1

                break;
            case 'title-atoz':
                sort.title = 1

                break;
            case 'title-ztoa':
                sort.title = -1

                break;
            default:
                sort.price = 1
                break;
        }

        const Products = await Product.find(filter).sort(sort);
        res.status(200).json({
            success: "true",
            data: Products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
        
    }
};

const getProductDetails = async(req, res)=>{
    try {
        const {id} = req.params;

        const product = await Product.findById(id);

        if(!product) return res.status(404).json({
            success:'false',
            message: 'Product Not Found',
        });

        res.status(200).json({
            success:'false',
            data : product,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}

module.exports = {getFilteredProducts, getProductDetails}