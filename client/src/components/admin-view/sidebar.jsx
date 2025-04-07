import { adminSidebarMenuItems } from "@/config";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

function MenuItem({setOpen}){
    const navigate = useNavigate();
    return <nav className="mt-8 flex-col flex gap-2">
        {
            adminSidebarMenuItems.map(menuItem=> <div key={menuItem.id} onClick={()=>{
                navigate(menuItem.path);
                setOpen ? setOpen(false) : null;
            }} className="flex text-2xl items-center cursor-pointer gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                {menuItem.label}
            </div>)
        }
    </nav>
}

function AdminSideBar({open, setOpen}) {
    const navigate = useNavigate();
    return <Fragment>
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                    <SheetHeader className='border-b'>
                        <SheetTitle>Admin Panel</SheetTitle>
                    </SheetHeader>
                    <MenuItem setOpen={setOpen}/>
                </div>
            </SheetContent>
        </Sheet>
         <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
            <div onClick={()=>navigate('/admin/dashboard')} className="flex cursor-pointer  items-center gap-2">
              <h1 className="text-xl font-extrabold">  Admin Panel</h1>
            </div>
            <MenuItem/>
         </aside>
    </Fragment>
}
    
export default AdminSideBar;