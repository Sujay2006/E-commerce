import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCardItemContent ({cartItems}){
  const {productList} = useSelector(state=> state.shopProducts);
    const { toast } = useToast();
    
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    function handleCartItemDelete(getCartItem) {
        dispatch(
          deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
        ).then((data) => {
          if (data?.payload?.success) {
            
            toast({
              title: "Cart item is deleted successfully",
            });
          }
        });
      }
    function handleUpdateQty(getCartItem, typeOfAction){
      console.log(getCartItem, "get");
      if (typeOfAction == "plus"){
        // let getCartItems = cartItems?.productId;
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        console.log(getCurrentProductIndex,"getCurrentProductIndex");
        
        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        const getQuantity = getCartItem.quantity;
        console.log(getTotalStock,getQuantity, "getit");
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
        
      }
      dispatch(updateCartQuantity({userId: user?.id, productId: getCartItem?.productId ,quantity:
            typeOfAction == 'plus' ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1 
        } )).then(data=>{
            if (data?.payload?.success) {
            
                toast({
                  title: "Cart item is updated successfully",
                });
              }
        })
    }
    
    return (
        <div className="flex items-center space-x-4">
            <img src={cartItems?.image} alt={cartItems?.title} className="w-20 h-20 rounded object-cover"/>
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItems?.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Button
                     disabled={cartItems?.quantity == 1}
                     onClick={()=>handleUpdateQty(cartItems, "minus")} 
                     variant="outline" size="icon">
                        <Minus className="w-4 h-4"/>
                    </Button>
                    <span className="font-extrabold">{cartItems?.quantity}</span>
                    <Button onClick={()=>handleUpdateQty(cartItems, "plus")}  variant="outline" size="icon">
                        <Plus className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
            <div className="flex items-end flex-col">
                <p className="font-semibold">
                    ${((
                        cartItems?.salePrice ? cartItems?.salePrice : cartItems?.price) * cartItems?.quantity
                        ).toFixed(2)}
                </p>
                <Trash size={20} onClick={() => handleCartItemDelete(cartItems)} className="cursor-pointer mt-1"/>
            </div>
        </div>
    )
}

export default UserCardItemContent;