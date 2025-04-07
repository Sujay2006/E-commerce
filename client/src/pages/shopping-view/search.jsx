import ProductDetail from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { getSearchResult, resetSearchResult } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
    const dispatch = useDispatch()
    const [keyword, setKeyword] = useState('');
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const {searchResult} = useSelector(state => state.shopSearch);
    const { productDetails } = useSelector((state) => state.shopProducts);
    const {cartItems} = useSelector(state=> state.shopCarts);
    const {user} = useSelector(state=> state.auth);
    const { toast } = useToast();
    
    useEffect(() => {
        if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
          setTimeout(() => {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(getSearchResult(keyword));
          }, 1000);
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResult());
          }
      }, [keyword]);
      function handleAddToCart(getCurrentProductId, getTotalStock){
        console.log(getCurrentProductId);
        let getCartItems = cartItems.items || [];

        if(getCartItems.length){
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId);
            if(indexOfCurrentItem > -1){
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;

                if(getQuantity + 1 > getTotalStock){
                    toast({
                        title : `Only ${getQuantity} quantity can be added for this item`,
                        variant: "destructive"
                    })
                    return;
                }

            }
        }
        dispatch(addToCart({userId: user?.id, productId: getCurrentProductId, quantity:1})).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id));
                toast({title: "Product is added to the Cart"});
            }
        })
    }

      function handleGetProductDetails(getCurrentProductId) {
        console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId));
      }
      useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
      }, [productDetails]);
    console.log(searchResult,"searchResult");
    
    return(
        <div className="mx-auto container md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input 
                    value = {keyword}
                    onChange={(event)=> setKeyword(event.target.value)}
                    name = 'keyword'
                    placeholder='Search Product....' 
                    className="py-6"/>
                </div>
            </div>
            {!searchResult.length ? (
                <h1 className="text-5xl font-extrabold">No result found!</h1>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {searchResult.map((item) => (
                <ShoppingProductTile
                handleAddToCart={handleAddToCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                />
                ))}
            </div>
            <ProductDetail
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    )
}

export default SearchProducts;