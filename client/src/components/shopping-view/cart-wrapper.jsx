import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCardItemContent from "./cart-item-content";

function UserCartWrapper ({cartItems, setOpenCartSheet}){
    const navigate = useNavigate();
    const totalAmount = cartItems?.length 
    ? cartItems.reduce((sum, item) => {
        const price = item?.salePrice > 0 ? item?.salePrice : item?.price;
        return sum + (price || 0) * (item?.quantity || 0);
    }, 0)
    : 0;

        
    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your's Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
            {
                    cartItems && cartItems.length > 0 
                        ? cartItems.map((item) => <UserCardItemContent key={item.productId} cartItems={item} />) 
                        : <p className="text-center text-gray-500">Your cart is empty.</p>
                }
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${totalAmount}</span>
                </div>
            </div>
            <Button onClick={()=> {
                navigate('/shop/checkout');
                setOpenCartSheet(false);
                }}
                className="w-full mt-5">CheckOut</Button>
        </SheetContent>
    )
}

export default UserCartWrapper;