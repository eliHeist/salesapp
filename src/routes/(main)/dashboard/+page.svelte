<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
	import { ArrowUpRight, DollarSign, Wallet, TrendingUp } from 'lucide-svelte';
    import type { PageData } from './$types';
	import SalesCard from './SalesCard.svelte';
	import RevenueCounter from './RevenueCounter.svelte';
	import RevenueChart from './RevenueChart.svelte';
	import SalesBarChart from './SalesBarChart.svelte';
	import RevenueBarChart from './RevenueBarChart.svelte';

    export let data:PageData;
</script>

<div class="grid gap-y-8">
	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
		<div class="text-muted-foreground">
			Welcome back! Here's an overview of your stock and sales.
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		<Card class="grid [grid-template-rows:_auto_1fr]">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
				<Wallet class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent class="">
                <div class="grid place-content-center h-full">
                    <RevenueCounter totalRevenue={data.totalRevenue._sum.total} />
                </div>
				<div class="hidden items-center space-x-2 text-sm text-green-600">
					<ArrowUpRight class="h-4 w-4" />
					<span>+20.1%</span>
				</div>
			</CardContent>
		</Card>
		<Card class="grid [grid-template-rows:_auto_1fr_auto]">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Most units sold</CardTitle>
                <TrendingUp class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <SalesCard totalSales={data.numberOfSales} topSellers={data.topSellingProducts}/>
            <CardFooter></CardFooter>
		</Card>
		<Card class="grid [grid-template-rows:_auto_1fr_auto]">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Highest Revenue Earned</CardTitle>
                <DollarSign class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
			<RevenueChart totalRevenue={data.totalRevenue._sum.total} topRevenuers={data.topRevenueProducts}/>
            <CardFooter></CardFooter>
		</Card>
	</div>

	<div class="grid gap-4 max-w-full">
		<Card class="grid [grid-template-rows:_auto_1fr_auto] max-w-full">
			<CardHeader>
				<CardTitle>Sales Overview</CardTitle>
			</CardHeader>
			<CardContent>
                <SalesBarChart salesData={data.saleBatches}/>
			</CardContent>
		</Card>
		<Card class="grid [grid-template-rows:_auto_1fr_auto] max-w-full">
			<CardHeader>
				<CardTitle>Revenue Overview</CardTitle>
			</CardHeader>
			<CardContent>
                <RevenueBarChart salesData={data.saleBatches}/>
			</CardContent>
		</Card>
	</div>
</div>