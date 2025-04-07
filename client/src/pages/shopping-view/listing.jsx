import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProductFilter from "./filter";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetail from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingListing() {

    const dispatch = useDispatch();
    const {productList, productDetails} = useSelector(state=> state.shopProducts);
    const {cartItems} = useSelector(state=> state.shopCarts);
    const {user} = useSelector(state=> state.auth);
    const [filter, setFilter]= useState({});
    const [sort, setSort] = useState("price-hightolow");
    const [openDetailDialogy, setOpenDetailDialogy] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const {toast} = useToast();

    const categorySearchParams = searchParams.get('category')

    function handleSort(value){
        setSort(value);
    }
    function handleFilter(getSelectedId, getCurrentOption){
        console.log(getSelectedId, getCurrentOption);

        let cpyFilters = {...filter};
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSelectedId);
        
        if(indexOfCurrentSection == -1){
            cpyFilters ={
                ...cpyFilters,
                [getSelectedId]: [getCurrentOption]
            }
        }else{
            const indexOfCurrentOption = cpyFilters[getSelectedId].indexOf(getCurrentOption);

            if(indexOfCurrentOption == -1) 
                cpyFilters[getSelectedId].push(getCurrentOption);
            else cpyFilters[getSelectedId].splice(indexOfCurrentOption, 1);
        }
        setFilter(cpyFilters);
        sessionStorage.setItem('filter', JSON.stringify(cpyFilters));
        
    }

    function createSearchParamsHelper(filterParams) {
        const queryParams = [];
      
        for (const [key, value] of Object.entries(filterParams)) {
          if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(",");
      
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
          }
        }
      
        console.log(queryParams, "queryParams");
      
        return queryParams.join("&");
      }

    function handleGetProductDetails(getCurrentProductId){
        console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId))
        
    }
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


    useEffect(()=>{
        setFilter(JSON.parse(sessionStorage.getItem('filter')) || {});
    },[categorySearchParams])


    useEffect(()=>{
        if(filter !== null && sort !== null)
        dispatch(fetchAllFilteredProducts({filterParams:filter, sortParams: sort}))
    },[dispatch,sort,filter])

    
    useEffect(()=>{
        if(filter && Object.keys(filter)?.length > 0){
            const createQueryString = createSearchParamsHelper(filter);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    },[filter, setSearchParams])


    useEffect(()=>{
        if(productDetails !== null) setOpenDetailDialogy(true)
    },[productDetails])
    
    console.log(cartItems, "productList");
    
    return(
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] lg:grid-cols-[260px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter handleFilter={handleFilter} filter={filter}/>
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Product</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{productList?.length} Products</span>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center">
                                <ArrowUpDownIcon className="h-4 w-4"/>
                                <span>Sort By</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className="w-[200px]">
                            <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                {
                                    sortOptions.map(sortItem=> <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>{sortItem.label}</DropdownMenuRadioItem>)
                                }
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                  
                </div>
                <Separator/>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
                {
                    productList && productList.length > 0 
                        ? productList.map(productItem => <ShoppingProductTile 
                            handleGetProductDetails={handleGetProductDetails} 
                            product={productItem} 
                            handleAddToCart={handleAddToCart}
                            />) 
                        : null
                }

                </div>
                <ProductDetail open={openDetailDialogy} setOpen={setOpenDetailDialogy} productDetails={productDetails}/>
            </div>
        </div>
        
    )
}

export default ShoppingListing;