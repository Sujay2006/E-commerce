import Address from "@/components/shopping-view/address";
import accImg from "../../assets/account.jpg"
import { useDispatch, useSelector } from "react-redux";
import UserCardItemContent from "@/components/shopping-view/cart-item-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {createNewOrder} from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";


function ShoppingCheckout() {
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
     const dispatch = useDispatch();
     const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const {cartItems} = useSelector(state=> state.shopCarts);
  const {user} = useSelector(state=> state.auth);
  const {approvalURL} = useSelector(state=> state.shopOrder);
  const { toast } = useToast();

  const totalAmount = cartItems?.items?.length 
  ? cartItems.items.reduce((sum, item) => {
      const price = item?.salePrice > 0 ? item?.salePrice : item?.price;
      return sum + (price || 0) * (item?.quantity || 0);
  }, 0)
  : 0;

  function handleInitiatePaypalPayment (){
    if (cartItems.length === 0) {
        toast({
          title: "Your cart is empty. Please add items to proceed",
          variant: "destructive",
        });
  
        return;
      }
      if (currentSelectedAddress === null) {
        toast({
          title: "Please select one address to proceed.",
          variant: "destructive",
        });
  
        return;
      }
    const orderData = {
        userId : user?.id,
        cartId : cartItems?._id,
            cartItems :cartItems.items.map((singleCartItem) =>({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
                quantity: singleCartItem?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus:'pending',
            paymentMethod: "paypal",
            paymentStatus: 'pending',
            totalAmount: totalAmount,
            orderDate: new Date(),
            orderUpdateDate:new Date(),
            paymentId : '',
            payerId :'',
          
    }
    dispatch(createNewOrder(orderData)).then((data)=>{
        console.log(data);
        if (data?.payload?.success) {
            setIsPaymemntStart(true);
          } else {
            setIsPaymemntStart(false);
          }
    })
    

  }
  if(approvalURL){
    window.location.href = approvalURL;
  }

 
  console.log(cartItems,'CHECK');

  
    return(
        <div className="flex flex-col">
            <div className="relative h-[250px] w-full overflow-hidden">
                <img src={accImg} alt="" className="h-full w-full object-cover object-center"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5 p-5">
                <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress}/>
                <div className="flex flex-col gap-4">
                    {
                        cartItems && cartItems.items && cartItems.items.length > 0 ? 
                        cartItems.items.map((item)=> <UserCardItemContent key={item} cartItems={item}/>)
                        : null
                    }
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalAmount}</span>
                        </div>
                    </div>
                    <div className="mt-4 ">
                        <Button onClick={handleInitiatePaypalPayment} className="mt-4 w-full">
                        {isPaymentStart
                        ? "Processing Paypal Payment..."
                        : "Checkout with Paypal"}
                        </Button>
                    </div>
                </div>
            
            </div>
        </div>
    )
}

export default ShoppingCheckout;