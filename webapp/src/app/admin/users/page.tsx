"use client"

import { UserDialog } from "@/components/admin/components/user/userDialog";
import { UserList } from "@/components/admin/components/user/userList";
import { AdminHeader } from "@/components/admin/layout/header"
import { Role, User } from "@/types/user";
import { useEffect, useState } from "react"

export default function Users() {
    const [users, setUsers] = useState<Array<User>>([]);
    const [roles, setRoles] = useState<Array<Role>>([]);

    useEffect(() => {
        fetch("/api/users", {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            }
        })

        fetch("/api/roles", {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (res.ok) {
                setRoles(data);
            }
        })
    }, [])

    return (
        <>
            <AdminHeader title={"Users management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-3 px-4 lg:px-6">
                            <UserDialog setUsers={setUsers} roles={roles} />
                            <UserList users={users} setUsers={setUsers} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
