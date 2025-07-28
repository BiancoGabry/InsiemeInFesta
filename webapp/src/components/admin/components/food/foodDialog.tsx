import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Food } from "@/types/food"
import { Pencil, PlusCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/types/category"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(0).max(200),
    price: z.string()
        .min(1, "Il prezzo è obbligatorio")
        .refine(val => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "Il prezzo deve essere un numero maggiore di 0"
        })
        .refine(val => {
            // Verifica che abbia massimo 2 decimali
            return /^\d+(\.\d{1,2})?$/.test(val);
        }, {
            message: "Il prezzo può avere massimo 2 decimali"
        }),
    categoryId: z.number().min(0, "Category ID not valid!"),
    available: z.boolean()
})

interface FoodDialogProp {
    food?: Food
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
    categories: Array<Category>
}

export function FoodDialog({ food, setFoods, setShow, categories }: FoodDialogProp) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: food?.name || "",
            description: food?.description || "",
            price: food?.price.toString() || "15.69",
            categoryId: food?.categoryId || 1,
            available: food?.available
        }
    })

    function createFood(values: z.infer<typeof formSchema>) {
        fetch("/api/foods", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) return;
            form.reset();
            setFoods(prev =>
                [...prev, data]
            );
        })
    }

    function updateFood(values: z.infer<typeof formSchema>) {
        fetch(`/api/foods/${food?.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) return
            if (setShow) setShow(data.available);
            setFoods(prev =>
                prev.map(f => f.id === data.id ? { ...f, ...data } : f)
            );
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    food ?
                        <Button size={"icon"} className="size-7" variant="edit">
                            <Pencil />
                        </Button>
                        :
                        <Button className="w-min">
                            <PlusCircle />
                            Create new Food
                        </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            food ? "Update " : "New "
                        }
                        Food
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <FoodForm
                    form={form}
                    onSubmit={food ? updateFood : createFood}
                    food={food}
                    categories={categories}
                />
            </DialogContent>
        </Dialog>
    )
}

interface FoodFormProps {
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    food?: Food
    categories: Array<Category>
}

function FoodForm({ form, onSubmit, food, categories }: FoodFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Food Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Pizza" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is category display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="The best italian food" {...field} />
                            </FormControl>
                            <FormDescription>
                                Food description.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price €</FormLabel>
                            <FormControl>
                                <Input placeholder="15.69" {...field} />
                            </FormControl>
                            <FormDescription>
                                Food price.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        categories.map(category =>
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormLabel>Available</FormLabel>
                            <FormControl>
                                <Checkbox
                                    id="available"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="size-5 accent-primary"
                                />
                            </FormControl>
                            <FormDescription>
                                Show food as available.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {
                        food ?
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-500/80 text-white">Edit</Button>
                            :
                            <Button type="submit">Create</Button>
                    }
                </DialogFooter>
            </form>
        </Form>
    )
}