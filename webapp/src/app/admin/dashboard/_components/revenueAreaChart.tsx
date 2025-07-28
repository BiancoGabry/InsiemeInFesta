"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { RevenueStats } from "@/types/stats"
import { cn } from "@/lib/utils"

export const description = "A simple area chart"

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

interface RevenueAreaChartProps {
    stats: RevenueStats
    className?: string
}

export function RevenueAreaChart({ stats, className }: RevenueAreaChartProps) {
    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader>
                <CardTitle>Revenue per day</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0 h-full min-h-0">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <AreaChart
                        accessibilityLayer
                        data={stats.revenuePerDay}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("it-IT", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("it-IT", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    nameKey="revenue"
                                    formatter={(value) => `${value}€`}
                                />
                            }
                        />
                        <Area
                            dataKey="revenue"
                            type="natural"
                            fill="var(--color-revenue)"
                            fillOpacity={0.4}
                            stroke="var(--color-revenue)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
