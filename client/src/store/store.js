import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import AdminProductsSlice from './admin/product-slice/index';
import adminOrderSlice from './admin/order-slice/index';
import shoppingProductSlice from './shop/product-slice/index';
import shoppingCartSlice from './shop/cart-slice/index';
import shoppingAddressSlice from './shop/address-slice/index';
import shoppingOrderSlice from './shop/order-slice/index';
import shoppingSearchSlice from './shop/search-slice/index';
import shoppingReviewSlice from './shop/review-slice/index';




const store = configureStore({
    reducer : {
        auth : authReducer,

        
        adminProducts: AdminProductsSlice,
        shopProducts : shoppingProductSlice,
        adminOrder: adminOrderSlice,


        shopCarts: shoppingCartSlice,
        shopAddress: shoppingAddressSlice,
        shopOrder: shoppingOrderSlice,
        shopSearch: shoppingSearchSlice,
        shopReview: shoppingReviewSlice,
    },
});

export default store;