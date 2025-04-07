import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile ({product, setOpenCreateProductsDialog, setCurrentEditedId, setFormData,handleDelete}) {
    return(
        <Card className="w-full max-w-sm mx-auto">
            <div className="">
                <div className="relative">
                    <img
                    src={product?.image}
                    alt={product?.title}
                    className="w-full h-[200px] object-cover rounded-t-lg"
                    />
                </div>
                <CardContent className='pb-2'>
                    <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${
                            product?.salePrice>0 ? "line-through" : ''
                        } text-lg font-bold text-primary` } >${product?.price}</span>
                        {
                            product?.salePrice > 0 ? (
                                <span className="text-lg font-bold">${product?.salePrice}</span>
                            ): null
                        }
                        
                        <span className="text-lg font-bold">{product?.totalStock}</span>
                    </div>
                </CardContent>
                <CardFooter className="pb-24flex justify-between items-center">
                        <Button onClick={()=>{
                            setOpenCreateProductsDialog(true)
                            setCurrentEditedId(product?._id)
                            setFormData(product)
                        }}
                        
                        >Edit</Button>
                        <Button onClick= {()=>handleDelete(product?._id)}>Delete</Button>
                </CardFooter>
            </div>
        </Card>
    )
}

export default AdminProductTile;