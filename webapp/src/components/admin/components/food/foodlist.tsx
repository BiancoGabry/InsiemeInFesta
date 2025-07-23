import { Food } from "@/types/food";

interface FoodListProps {
    foods: Array<Food>
}

export function FoodList({ foods }: FoodListProps){
    return(
        <div className="grid grid-cols-3 gap-3">
            {
                foods.map(food => (
                    <FoodCard food={food} />
                ))
            }
        </div>
    )
}

interface FoodCardProps {
    food: Food
}

function FoodCard({ food }: FoodCardProps) {
    return(
        <div className="bg-secondary p-3">
            { food.name }
        </div>
    )
}