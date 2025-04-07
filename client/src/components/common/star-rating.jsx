import { StarIcon } from "lucide-react"
import { Button } from "../ui/button"


function StarRatingComponent({rating, handleRatingChange}){
    return (
        [1,2,3,4,5].map((star)=>(
            <Button key={star}
            className={`p-4 rounded-full transition-colors ${star <= rating ? 'text-yellow-500 hover:bg-black' : 'text-black hover:bg-primary hover:text-primary-foreground'}`}
             variant="outline"
             onClick={ handleRatingChange ? ()=>handleRatingChange(star): null}
              size="icon">
                <StarIcon className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400':'fill-black'}`}/>
            </Button>
        ))
    )
}

export default StarRatingComponent