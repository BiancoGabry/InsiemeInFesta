'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface UserListProp {
    users: Array<User>
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

export function UserList({ users, setUsers }: UserListProp) {

    const [thisUser, setThisUser] = useState({ username: "", role: "" });

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        setThisUser(JSON.parse(userStr));
    }, [])

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {
                users.map(user => (
                    <UserCard key={user.id} user={user} thisUser={thisUser.username} setUsers={setUsers} />
                ))
            }
        </div>
    )
}

interface UserCardProp {
    user: User
    thisUser: string
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

function UserCard({ user, thisUser, setUsers }: UserCardProp) {

    function deleteUser() {
        fetch(`/api/users/${user.id}`, {
            method: "DELETE",
            credentials: "include"
        }).then(async res => {
            await res.json();
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== user.id));
            }
        })
    }

    return (
        <div className="bg-secondary p-3 rounded-md flex place-content-between items-center">
            <div className="flex flex-col gap-0.5 items-start">
                <h3 className="font-semibold text-xl">
                    {user.username}
                </h3>
                <p className="text-sm">
                    <Badge variant={user.role.name === "operator" ? "outline" : "default"} >
                        {user.role.name}
                    </Badge>
                </p>
            </div>
            <Button
                variant={"destructive"}
                size={"icon"}
                disabled={thisUser == user.username}
                onClick={() => deleteUser()}
            >
                <Trash2 />
            </Button>

        </div>
    )
}