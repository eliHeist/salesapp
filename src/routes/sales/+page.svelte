<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageData } from './$types';

	import SelectCombo from './SelectCombo.svelte';
	import type { Product } from '@prisma/client';

	export let data: PageData;

	let showForm = false;

    let selectedProduct: Product | null = null;
    $: productId = selectedProduct?.id;
    $: stock = selectedProduct?.stock || 0;

</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Sales</h2>
		<Button on:click={() => (showForm = !showForm)}>
			{showForm ? 'Cancel' : 'New Sale'}
		</Button>
	</div>

	{#if showForm}
		<form method="POST" action="?/create" use:enhance class="space-y-4 rounded-lg bg-card p-4 border ">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="productId">Product</Label>
                    <br>
                    <SelectCombo products={data.products} bind:selectedProduct />
                    <input type="text" class="hidden" name="productId" bind:value={productId} required>
				</div>
				<div class="space-y-2">
					<Label for="quantity">Quantity</Label>
					<Input id="quantity" name="quantity" type="number" min="1" max={stock} required />
				</div>
			</div>
			<Button type="submit">Create Sale</Button>
		</form>
	{/if}

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Product</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead>Total</TableHead>
					<TableHead>Date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each data.sales as sale}
					<TableRow>
						<TableCell>{sale.product.name}</TableCell>
						<TableCell>{sale.quantity}</TableCell>
						<TableCell>{sale.total.toLocaleString('en-US')}</TableCell>
						<TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
