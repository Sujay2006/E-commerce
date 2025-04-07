import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import { Fragment } from "react";

function ProductFilter({handleFilter, filter}) {
    return(
        <div className="bg-background rounded-lg  shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {
                    Object.keys(filterOptions).map((keyItem, index)=> <Fragment  key={index}>
                        <div className="text-base font-bold">
                            <h3>{keyItem}</h3>
                        </div>
                        <div className="grid gap-2 mt-2">
                            {
                                filterOptions[keyItem].map((option, index)=> <Label className="flex items-center gap-2 font-medium" key={index} >
                                    <Checkbox
                                    checked={!!filter[keyItem] && filter[keyItem].includes(option.id)}
                                    
                                     onCheckedChange={()=>handleFilter(keyItem, option.id)}/>
                                    {option.label}
                                </Label>)
                            }
                        </div>
                        <Separator/>
                    </Fragment>)
                }
            </div>
        </div>
    )
}

export default ProductFilter;