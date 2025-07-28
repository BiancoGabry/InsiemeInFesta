'use client'

import { Button } from "@/components/ui/button";
import { Food } from "@/types/food";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { FoodDialog } from "./foodDialog";
import { Category } from "@/types/category";

interface FoodListProps {
    foods: Array<Food>
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>
    categories: Array<Category>
}

export function FoodList({ foods, setFoods, categories }: FoodListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {
                foods.map(food => (
                    <FoodCard key={food.id} food={food} setFoods={setFoods} categories={categories} />
                ))
            }
        </div>
    )
}

interface FoodCardProps {
    food: Food
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>
    categories: Array<Category>
}

function FoodCard({ food, setFoods, categories }: FoodCardProps) {
    const [show, setShow] = useState<boolean>(food.available || false)

    function deleteFood() {
        fetch(`/api/foods/${food.id}`, {
            method: "DELETE",
            credentials: "include"
        }).then(async res => {
            await res.json();
            if (res.ok) {
                setFoods(prev => prev.filter(f => f.id !== food.id));
            }
        })
    }

    function handleAvailable() {
        fetch(`/api/foods/available/${food.id}`, {
            method: "PATCH",
            credentials: "include"
        }).then(async res => {
            await res.json();
            if (res.ok) {
                setShow(!show);
            }
        });
    }

    return (
        <div className="bg-secondary p-3 rounded-md flex place-content-between">
            <div className="flex flex-row gap-1.5 items-center">
                <Button variant={"destructive"} size={"icon"} className="size-7" onClick={() => deleteFood()}>
                    <Trash2 />
                </Button>
                {food.name}
            </div>

            <div className="flex flex-row gap-1.5 items-center">
                <Button size={"icon"} variant={"ghost"} onClick={() => handleAvailable()}>
                    {
                        show ?
                            <Eye />
                            :
                            <EyeOff />
                    }
                </Button>
                <FoodDialog food={food} setFoods={setFoods} setShow={setShow} categories={categories} />
            </div>
        </div>
    )
}