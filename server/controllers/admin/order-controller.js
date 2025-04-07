const Order = require("../../models/Order");

const getAllOrdersByAllUser = async(req, res)=>{
    try{

      const orders = await Order.find({ });

      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No orders found!",
        });
      }

      res.status(200).json({
        success: true,
        data: orders,
      });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async(req, res)=>{
  try {
    const { id } = req.params;
    const {orderStatus} = req.body;

    const order = await Order.findById(id);
    

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, {orderStatus});
    
    return res.status(200).json({
      success: true,
      message: "Order Updated succecfully",
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}

module.exports = {getAllOrdersByAllUser,getOrderDetails, updateOrderStatus}