import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg"
import Order from "@/components/shopping-view/order";
import Address from "@/components/shopping-view/address";


function ShoppingAccount() {
    
        
    return(
        <div className="flex flex-col">
            <div className="relative h-[250px] w-full overflow-hidden">
                <img src={accImg} alt="" className="h-full w-full object-cover object-center"/>
            </div>
            <div className="container mx-auto grid grid-cols-1 py-8 gap-8">
                <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <Tabs defaultValue="order">
                        <TabsList>
                            <TabsTrigger value="order" >Order</TabsTrigger>
                            <TabsTrigger value="address" >Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value="order"><Order/></TabsContent>
                        <TabsContent value="address"><Address/></TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ShoppingAccount;