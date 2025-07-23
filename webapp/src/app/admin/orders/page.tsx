"use client"

import { AdminHeader } from "@/components/admin/layout/header"
import OrderCard from "@/components/order/orderCard";
import OrderPagination from "@/components/order/orderPagination";
import OrderSearch from "@/components/order/orderSearch";
import { Order } from "@/types/order";
import { Page } from "@/types/page";
import { useEffect, useState } from "react"

export default function Orders() {
    const [allOrders, setAllOrders] = useState<Array<Order>>([]);
    const [orders, setOrders] = useState<Array<Order>>([]);
    const [text, setText] = useState("");
    const [index, setIndex] = useState(1);
    const [ page, setPage ] = useState<Page | null>(null);

    useEffect(() => {
        fetch(`/api/orders/pages/${index}`, {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            setOrders(data.orders);
            setAllOrders(data.orders);
            setPage(data.pagination);
        })
    }, [index])

    return (
        <>
            <AdminHeader title={"Orders management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="px-4 lg:px-6 flex flex-col gap-6">
                            <OrderSearch setOrders={setOrders} className=" md:w-[300px]" checkAll text={text} setText={setText} />
                            <div className="grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {
                                    text == ""
                                        ?
                                        allOrders.map(order => (
                                            <OrderCard key={order.id} order={order} value={text} />
                                        ))
                                        :
                                        orders.map(order => (
                                            <OrderCard key={order.id} order={order} value={text} />
                                        ))
                                }
                            </div>
                        </div>
                        {
                            page && !text ? 
                            <OrderPagination page={page} index={index} setIndex={setIndex} />
                            :
                            <></>
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}
