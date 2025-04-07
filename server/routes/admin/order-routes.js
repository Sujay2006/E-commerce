const express = require("express");
const { getAllOrdersByAllUser,getOrderDetails,updateOrderStatus } = require("../../controllers/admin/order-controller") ;

const router = express.Router();

router.get("/get", getAllOrdersByAllUser);
router.get("/details/:id", getOrderDetails);
router.put("/update/:id", updateOrderStatus);
module.exports = router;