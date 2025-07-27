import { Category } from "@/types/category";

export async function getCategories() : Promise<Array<Category>> {
    return await fetch("/api/categories/available")
        .then(res => res.json())
        .catch(err => console.log("error"));
}