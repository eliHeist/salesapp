<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ArrowUpRight, ArrowDownRight, Package, DollarSign, Users, TrendingUp } from 'lucide-svelte';
</script>

<div class="space-y-8">
	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
		<div class="text-muted-foreground">
			Welcome back! Here's an overview of your stock and sales.
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
				<DollarSign class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">$45,231.89</div>
				<div class="flex items-center space-x-2 text-sm text-green-600">
					<ArrowUpRight class="h-4 w-4" />
					<span>+20.1%</span>
				</div>
			</CardContent>
		</Card>
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Products in Stock</CardTitle>
				<Package class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">2,350</div>
				<div class="flex items-center space-x-2 text-sm text-red-600">
					<ArrowDownRight class="h-4 w-4" />
					<span>-4.5%</span>
				</div>
			</CardContent>
		</Card>
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Sales</CardTitle>
				<TrendingUp class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">12,234</div>
				<div class="flex items-center space-x-2 text-sm text-green-600">
					<ArrowUpRight class="h-4 w-4" />
					<span>+19%</span>
				</div>
			</CardContent>
		</Card>
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Active Users</CardTitle>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">573</div>
				<div class="flex items-center space-x-2 text-sm text-green-600">
					<ArrowUpRight class="h-4 w-4" />
					<span>+201</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<Card class="lg:col-span-4">
			<CardHeader>
				<CardTitle>Sales Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="h-[350px] flex items-center justify-center text-muted-foreground">
					Sales chart will be implemented here
				</div>
			</CardContent>
		</Card>
		<Card class="lg:col-span-3">
			<CardHeader>
				<CardTitle>Recent Sales</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-8">
					{#each Array(5) as _}
						<div class="flex items-center">
							<div class="space-y-1">
								<p class="text-sm font-medium leading-none">Product Name</p>
								<p class="text-sm text-muted-foreground">2 hours ago</p>
							</div>
							<div class="ml-auto font-medium">+$250.00</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>
</div>