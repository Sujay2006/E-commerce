import { Card, CardContent } from "@/components/ui/card";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp"
import { Button } from "@/components/ui/button";
import {
    Airplay,
    BabyIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloudLightning,
    Heater,
    Images,
    Shirt,
    ShirtIcon,
    ShoppingBasket,
    UmbrellaIcon,
    WashingMachine,
    WatchIcon,
  } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetail from "@/components/shopping-view/product-details";

const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];
  
  const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
  ];


function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const {productList, productDetails} = useSelector(state=> state.shopProducts);
    const [openDetailDialogy, setOpenDetailDialogy] = useState(false);
    const {user} = useSelector(state=> state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();
    const slides = [bannerOne,bannerTwo,bannerThree];

    useEffect(()=>{
      const timer = setInterval(()=>{
        setCurrentSlide(prevSlide=>(prevSlide+1)%slides.length)
      }, 5000)

      return ()=> clearInterval(timer)
    },[])

    useEffect(()=>{
      dispatch(fetchAllFilteredProducts({filterParams:{}, sortParams:'price-lowtohigh'}))
    },[dispatch])

    function handleNavigateToListingPage (getCurrentItem, section){
      sessionStorage.removeItem('filter');
      const currentFilter = {
        [section] : [getCurrentItem.id]
      }
      sessionStorage.setItem('filter', JSON.stringify(currentFilter));
      console.log(sessionStorage.getItem("filter"), "session");

      navigate('/shop/listing')
    }
    function handleGetProductDetails(getCurrentProductId){
      dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handleAddToCart(getCurrentProductId){
            console.log(getCurrentProductId);
            dispatch(addToCart({userId: user?.id, productId: getCurrentProductId, quantity:1})).then((data)=>{
                if(data?.payload?.success){
                    dispatch(fetchCartItems(user?.id));
                    toast({title: "Product is added to the Cart"});
                }
            })
        }
     useEffect(()=>{
          if(productDetails !== null) setOpenDetailDialogy(true)
      },[productDetails])
    return(
        <div className="flex flex-col min-h-screen">
            <div className="relative overflow-hidden w-full h-[500px]">
                {
                    slides.map((slide,index)=> <img
                    src={slide}
                    key={index}
                    className={`${index == currentSlide ? 'opacity-100': 'opacity-0'} absolute top-0 w-full h-full object-cover left-0 transition-opacity duration-1000`}
                    />)
                }
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide(
                        (prevSlide) =>
                            (prevSlide - 1 + slides.length) %
                        slides.length
                        )
                    }
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                    >
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide(
                        (prevSlide) => (prevSlide + 1) % slides.length
                        )
                    }
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                    >
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {
                            categoriesWithIcon.map(item => <Card 
                            onClick={() => handleNavigateToListingPage(item, "category")}
                            key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6 ">
                                <item.icon className="w-12 h-12 mb-4 text-primary"/>
                                <span>{item.label}</span>
                                </CardContent>

                            </Card>)
                        }
                    </div>
                </div>
            </section>
            <section className="py-12 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {brandsWithIcon.map((brandItem) => (
                    <Card
                    key={bannerOne.id}
                      onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                        <span className="font-bold">{brandItem.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            <section className="p-12">
              <div className="container mx-auto my-2 p-4">
                <h2 className="text-3xl font-bold text-center mb-8">Feature Product</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                  productList && productList.length > 0 ?
                  productList.map(productItem => <ShoppingProductTile 
                    handleGetProductDetails={handleGetProductDetails} 
                    product={productItem} 
                    handleAddToCart={handleAddToCart}
                  />)
                  : null
                }
              </div>
            </section>
            <ProductDetail open={openDetailDialogy} setOpen={setOpenDetailDialogy} productDetails={productDetails}/>
        </div>
    )
}

export default ShoppingHome;