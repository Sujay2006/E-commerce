const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Card = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async(req, res)=>{
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
          } = req.body;
          console.log(cartItems
            );
          const calculatedTotal = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price ?? 0) * (item.quantity ?? 1));
        }, 0);
        console.log("Calculated Total:", calculatedTotal);
        
            
         const create_payment_json = {
            intent: "sale",
            payer: {
              payment_method: "paypal",
            },
            redirect_urls: {
              return_url: `${CLIENT_BASE_URL}/shop/paypal-return`,
              cancel_url: `${CLIENT_BASE_URL}/shop/paypal-cancel`,
            },
            transactions: [
              {
                item_list: {
                  items: cartItems.map((item) => ({
                    name: item.title,
                    sku: item.productId,
                    price: (item.price ?? 0).toFixed(2),
                    currency: "USD",
                    quantity: item.quantity,
                  })),
                },
                amount: {
                  currency: "USD",
                  total: Number(calculatedTotal.toFixed(2)), 
                },
                description: "description",
              },
            ],
          };
          paypal.payment.create(create_payment_json, async(error, paymentInfo)=>{
            if(error){
              console.log(error,"payment");
              console.log(error?.response?.details,"details");
              res.status(500).json({
                  success:'false',
                  message: 'Error Occured will creating payment',
              });
            }else{
              console.log(paymentInfo);
              console.log(paymentInfo.transactions);
              
              const newlyCreatedOrder = new Order({
                userId,
                cartItems,
                addressInfo,
                orderStatus,
                paymentMethod,
                paymentStatus,
                totalAmount,
                orderDate,
                orderUpdateDate,
                paymentId,
                payerId,
               cartId,
              })
              await newlyCreatedOrder.save();

              const approvalURL = paymentInfo.links.find(link=> link.rel === 'approval_url').href;

              res.status(201).json({
                success: true,
                approvalURL,
                orderId: newlyCreatedOrder._id,
              })
            }
          })

        
    } catch (error) {
        console.log(error, "early");
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}
const capturePayment = async(req, res)=>{
    try {
      const {paymentId, payerId, orderId} = req.body;

      let order = await Order.findById(orderId);

      if(!order){
        return res.status(404).json({
          success: false,
          message: "Order cannot be found"
        })
      }

      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.paymentId = paymentId;
      order.payerId = payerId;

      for(let item of order.cartItems){
        let product = await Product.findById(item.productId);

        if(!product){
          return res.status(404).json({
            success:false,
            message: `Not enough stock for this product ${product.title}`
          })
        }

        product.totalStock -= item.quantity
        
        await product.save();
      }

      const getCartId = order.cartId;
      await Card.findByIdAndDelete(getCartId)

      await order.save();
      
      res.status(200).json({
        success: true,
        message: "Order Comfirmed",
        data: order,
      })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:'false',
            message: 'Error Occured',
        });
    }
}
const getAllOrdersByUser = async(req, res)=>{
    try{
      const { userId } = req.params;

      const orders = await Order.find({ userId });

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
module.exports ={createOrder,capturePayment, getAllOrdersByUser, getOrderDetails};