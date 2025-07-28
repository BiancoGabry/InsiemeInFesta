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
import { PlusCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Role, User } from "@/types/user"

const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8),
    roleId: z.number()
})

interface UserDialogProp {
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
    roles: Array<Role>
}

export function UserDialog({ setUsers, roles }: UserDialogProp) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            roleId: 1
        }
    })

    function createUser(values: z.infer<typeof formSchema>) {
        fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) return;
            form.reset();
            setUsers(prev =>
                [...prev, data]
            );
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    <Button className="w-min">
                        <PlusCircle />
                        Create new User
                    </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        New User
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <UserForm
                    form={form}
                    onSubmit={createUser}
                    roles={roles}
                />
            </DialogContent>
        </Dialog>
    )
}

interface UserFormProps {
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    roles: Array<Role>
}

function UserForm({ form, onSubmit, roles }: UserFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Mario" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is user display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
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
                                        roles.map(role =>
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}