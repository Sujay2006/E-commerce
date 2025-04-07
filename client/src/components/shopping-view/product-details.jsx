import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetail({ open, setOpen, productDetails }) {
    const {cartItems} = useSelector(state=> state.shopCarts);
    const {reviews} = useSelector(state=> state.shopReview);
    const {toast} = useToast();
    const {user} = useSelector(state=> state.auth);
    const dispatch = useDispatch();
    const[reviewMsg, setReviewMsg] = useState("");
    const[rating, setRating] = useState(0);
    
    function handleRatingChange(getRating){
        setRating(getRating);
    }
    function handleAddReview(){
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(getReviews(productDetails?._id));
                toast({
                    title:"Review added SuccessFully"
                });
                setRating(0);
                setReviewMsg('')
            }
            console.log(data);
            
        })
    }
    function handleAddToCart(getCurrentProductId, getTotalStock){
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
            console.log(getCurrentProductId);
            dispatch(addToCart({userId: user?.id, productId: getCurrentProductId, quantity:1})).then((data)=>{
                if(data?.payload?.success){
                    dispatch(fetchCartItems(user?.id));
                    toast({title: "Product is added to the Cart"});
                }
            })
        }
    function handleDialogClose(){
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg('')
    }
    useEffect(()=>{
        if(productDetails != null ) 
            dispatch(getReviews(productDetails?._id)).then((data)=>{
                
            })
    },[productDetails])
    
    const averageReview = reviews && reviews.length > 0 ?
     reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /  reviews.length : 0;
    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] ">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="w-full h-auto max-h-full object-cover"
                    />
                </div>
                <div className="grid gap-6">
                    <div className="">
                        {/* Add DialogTitle for accessibility */}
                        <DialogTitle className="text-3xl font-extrabold">
                            {productDetails?.title}
                        </DialogTitle>
                        {/* Add DialogDescription for accessibility */}
                        <DialogDescription className="text-muted-foreground my-4 text-xl">
                            {productDetails?.description}
                        </DialogDescription>
                        <div className="flex items-center justify-between">
                            <span
                                className={`${productDetails?.salePrice > 0 ? "line-through" : ""
                                    } text-lg font-semibold text-primary`}
                            >
                                ${productDetails?.price}
                            </span>
                            {productDetails?.salePrice > 0 ? (
                                <span className="text-lg font-semibold text-primary">
                                    ${productDetails?.salePrice}
                                </span>
                            ) : null}
                        </div>
                        <div className="m-2">
                            <div className="flex items-center gap-0.5">
                                <StarRatingComponent rating={averageReview}/>
                            </div>
                        </div>
                        <div className="mt-5 mb-2">
                        {
                            productDetails?.totalStock == 0 ?(
                                <Button  className="w-full opacity-55 cursor-not-allowed">
                                Out of Stock
                                </Button>
                            ):(
                                <Button onClick={()=>handleAddToCart(productDetails._id, productDetails?.totalStock)} className="w-full">
                                Add to cart
                            </Button>
                            )
                        }
                            
                        </div>
                        <Separator/>
                        <div className="max-h-[300px] overflow-auto">
                            <div className="text-xl font-bold mb-4">Review</div>

                            <div className="gird grid gap-6">
                            {
                                reviews && reviews.length > 0 ? 
                                reviews.map((reviewItem) => (
                                    <div className="flex gap-4" key={reviewItem.id}>
                                    <Avatar>
                                        <AvatarFallback className="w-10 h-10 border">
                                        {reviewItem?.userName?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <div className="flex items-center gap-2">
                                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                                        </div>
                                        <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                                    </div>
                                    </div>
                                )) : <h1>No Review</h1>
                                }

                               
                            </div>
                            <div className="mt-10 mx-2 flex flex-col gap-2">
                                <Label>Write a review</Label>
                                <div className="flex gap-2">
                                    <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange}/>
                                </div>
                                <Input 
                                value={reviewMsg}
                                onChange={(event)=>setReviewMsg(event.target.value)}
                                name="reviewMsg"
                                placeholder="write a review"/>
                                <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetail;
