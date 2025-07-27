"use client"

import { FoodDialog } from "@/components/admin/components/food/foodDialog";
import { FoodList } from "@/components/admin/components/food/foodlist";
import { AdminHeader } from "@/components/admin/layout/header"
import { Category } from "@/types/category";
import { Food as FoodType } from "@/types/food"
import { useEffect, useState } from "react"

export default function Food() {
    const [foods, setFoods] = useState<FoodType[]>([]);
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        fetch("/api/foods").then(async res => {
            const data = await res.json();
            setFoods(data);
        })

        fetch("/api/categories").then(async res => {
            const data = await res.json();
            setCategories(data);
        })
    }, []);

    return (
        <>
            <AdminHeader title={"Food management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-3 px-4 lg:px-6">
                            <FoodDialog setFoods={setFoods} categories={categories}/>
                            <FoodList foods={foods} setFoods={setFoods} categories={categories}  />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
