import { Food } from "@/types/food";

export async function getFoodsAvailable(categoryId: string) : Promise<Array<Food>> {
    return await fetch(`${process.env.API_URL}/foods/available/categories/${categoryId}`)
        .then(res => res.json())
}