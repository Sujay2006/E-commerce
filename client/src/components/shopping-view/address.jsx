import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form';
import { addressFormControls } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from '@/store/shop/address-slice';
import AddressCard from './address-cart';

const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  };
  
function Address({setCurrentSelectedAddress, selectedId}) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState();
    const dispatch = useDispatch();
    const {user} = useSelector(state=> state.auth);
    const {addressList} = useSelector(state=> state.shopAddress);

    function handleManageAddress (e){
        e.preventDefault();
        currentEditedId !== null ? dispatch(editAddress({
            userId : user?.id, addressId: currentEditedId, formData
        })).then((data)=>{
            if(data?.payload?.success){
                setFormData(initialAddressFormData);
                setCurrentEditedId(null)
                dispatch(fetchAllAddress(user?.id))
            }
        }) :
        
        dispatch(addNewAddress({
          ...formData,
          userId: user?.id
        })).then(data=>{
          console.log(data);
          dispatch(fetchAllAddress(user?.id));
          setFormData(initialAddressFormData);
        })
    }

    function isFormValid() {
        return Object.keys(formData)
          .map((key) => formData[key].trim() !== "")
          .every((item) => item);
      }
    useEffect(()=>{
      dispatch(fetchAllAddress(user?.id)).then(data=>{
        console.log(data);
      });
    },[dispatch,user])

    function handleDeleteAddress(addressInfo){
        
        dispatch(deleteAddress({userId:addressInfo?.userId, addressId:addressInfo?._id})).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddress(addressInfo?.userId))
            }
        })
    }
    function handleEditAddress(addressInfo){
        setCurrentEditedId(addressInfo?._id)
        setFormData({
            ...formData,
            address: addressInfo?.address,
            city: addressInfo?.city,
            phone: addressInfo?.phone,
            pincode: addressInfo?.pincode,
            notes: addressInfo?.notes,
        })
    }
    // console.log(addressList,"addressList");
    
  return (
    <Card>
        <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {
                addressList && addressList.length > 0 ?
                addressList.map(singleAddressItem=> <AddressCard setCurrentSelectedAddress={setCurrentSelectedAddress} addressInfo={singleAddressItem} handleEditAddress={handleEditAddress} handleDeleteAddress={handleDeleteAddress} selectedId={selectedId}/>)
                : null
            }
        </div>
        <CardHeader>
            <CardTitle>
                {
                    currentEditedId !== null ? "Edit Address" : "Add New Address"
                }
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>

    </Card>
  )
}

export default Address
