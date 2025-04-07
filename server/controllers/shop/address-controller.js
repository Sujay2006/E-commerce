const Address = require("../../models/Address");

const addAddress = async (req, res) => {
    try {
      const { userId, address, city, pincode, phone, notes } = req.body;
  
      if (!userId || !address || !city || !pincode || !phone || !notes) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided!",
        });
      }
  
      const newlyCreatedAddress = new Address({
        userId,
        address,
        city,
        pincode,
        notes,
        phone,
      });
  
      await newlyCreatedAddress.save();
  
      res.status(201).json({
        success: true,
        data: newlyCreatedAddress,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Error",
      });
    }
  };
const fetchAllAddress = async(req, res)=>{
    try {
        const {userId} = req.params;

        if(!userId ){
            return res.status(400).json({
                success: false,
                message: 'userId needed',
            });
        }

        const addressList = await Address.find({userId});

        return res.status(201).json({
            success: true,
            data: addressList,
       });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}
const editAddress = async(req, res)=>{
    try {
        const {userId, addressId} = req.params;
        const {  address, city, pincode, phone, notes } = req.body;

        if(!userId || !addressId ){
            return res.status(400).json({
                success: false,
                message: 'userId and addressId needed',
            });
        }
        

        const addresses  = await Address.findOneAndUpdate(
            {
            _id: addressId, 
            userId
            },
            {
                userId,
                address,
                city,
                pincode,
                notes,
                phone,
            },
            {new: true}
        );

        if(!addresses){
            return res.status(400).json({
                success: false,
                message: 'Address not found',
            }); 
        }

        return res.status(201).json({
            success: true,
            data: address,
       });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}
const deleteAddress = async(req, res)=>{
    try {
        const {userId, addressId} = req.params;
        
        if(!userId || !addressId ){
            return res.status(400).json({
                success: false,
                message: 'userId and addressId needed',
            });
        }
        
        const address  = await Address.findOneAndDelete({_id: addressId,userId});

        if(!address){
            return res.status(400).json({
                success: false,
                message: 'Address not found',
            }); 
        }

        return res.status(201).json({
            success: true,
            data: "address deleted successfully",
       });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}

module.exports ={ addAddress, fetchAllAddress, editAddress, deleteAddress};