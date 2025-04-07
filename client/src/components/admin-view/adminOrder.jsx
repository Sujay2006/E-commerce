import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'; 
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import AdminOrderdetailsView from './order-details';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/admin/order-slice';
import { Badge } from '../ui/badge';

function AdminOrder() {
  const dispatch = useDispatch();
  const [openDetailsDialog,setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder );


   useEffect(()=>{
      dispatch(getAllOrdersByUserId())
    },[dispatch]);
    useEffect(()=>{
        if(orderDetails != null) setOpenDetailsDialog(true)
    },[orderDetails])
  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetails(getId))
  }
  console.log(orderList, "orderList");
  
  return (
    <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Order Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList && orderList.length > 0
                  ? orderList.map((orderItem) => (
                      <TableRow key={orderItem?._id}>
                        <TableCell>{orderItem?._id}</TableCell>
                        <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-3 ${
                              orderItem?.orderStatus === "confirmed"
                                ? "bg-green-500"
                                : orderItem?.orderStatus === "rejected"
                                ? "bg-red-600"
                                : "bg-black"
                            }`}
                          >
                            {orderItem?.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>${orderItem?.totalAmount}</TableCell>
                        <TableCell>
                          <Dialog className="overflow-scroll"
                            open={openDetailsDialog}
                            onOpenChange={() => {
                              setOpenDetailsDialog(false);
                              dispatch(resetOrderDetails());
                            }}
                          >
                            <Button
                              onClick={() =>
                                handleFetchOrderDetails(orderItem?._id)
                              }
                            >
                              View Details
                            </Button>
                            <AdminOrderdetailsView orderDetails={orderDetails} />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
               
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  )
}

export default AdminOrder
