"use client"

import { AdminHeader } from "@/components/admin/layout/header";
import { FoodStats, OrderStats, RevenueStats } from "@/types/stats";
import { useEffect, useState } from "react";

import OrderBarChart from "./_components/orderBarChart";
import { OrderRadialChart } from "./_components/orderRadialChart";
import { FoodPieChart } from "./_components/foodPieChart";
import { RevenueAreaChart } from "./_components/revenueAreaChart";
import React from "react";

export default function Analytics() {

    const [ordersStats, setOrdersStats] = useState<OrderStats>({ totalOrders: 0, ordersPerDay: [] });
    const [foodsStats, setFoodsStats] = useState<FoodStats>({ foodOrdered: [] });
    const [revenueStats, setRevenueStats] = useState<RevenueStats>({ revenuePerDay: [] })
    const [totalFoods, setTotalFoods] = useState(0);

    useEffect(() => {
        fetch("/api/stats/total-orders", {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (res.ok) {
                setOrdersStats(data);
            }
        })

        fetch("/api/stats/foods-ordered", {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (res.ok) {
                setFoodsStats(data);
                setTotalFoods(data.foodOrdered.reduce((acc: number, curr: { quantity: string }) => acc + parseInt(curr.quantity), 0));
            }
        })

        fetch("/api/stats/revenue", {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (res.ok) {
                setRevenueStats(data);
            }
        })
    }, [])

    return (
        <>
            <AdminHeader title={"Analytics"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 px-4 lg:px-6">
                            <div className="col-span-3 grid grid-cols-2 xl:grid-cols-3 gap-3">
                                <OrderBarChart stats={ordersStats} className={"col-span-2 h-[370px]"} />
                                <OrderRadialChart totalOrders={ordersStats.totalOrders} className=" col-span-2 xl:col-span-1" />
                            </div>

                            <div className="col-span-3 grid grid-cols-2 xl:grid-cols-3 gap-3">
                                <FoodPieChart totalFoods={totalFoods} stats={foodsStats} className="col-span-2 xl:col-span-1 h-[370px]" />
                                <RevenueAreaChart stats={revenueStats} className="col-span-2 h-[370px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}