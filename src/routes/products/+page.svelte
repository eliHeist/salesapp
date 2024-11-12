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

	export let data: PageData;

	let showForm = false;
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Products</h2>
		<Button on:click={() => (showForm = !showForm)}>
			{showForm ? 'Cancel' : 'Add Product'}
		</Button>
	</div>

	{#if showForm}
		<form method="POST" action="?/create" use:enhance class="space-y-4 bg-card p-4 rounded-lg">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" required />
				</div>
				<div class="space-y-2">
					<Label for="sku">SKU</Label>
					<Input id="sku" name="sku" required />
				</div>
				<div class="space-y-2">
					<Label for="price">Price</Label>
					<Input id="price" name="price" type="number" step="0.01" required />
				</div>
				<div class="space-y-2">
					<Label for="stock">Stock</Label>
					<Input id="stock" name="stock" type="number" required />
				</div>
				<div class="col-span-2 space-y-2">
					<Label for="description">Description</Label>
					<Input id="description" name="description" />
				</div>
			</div>
			<Button type="submit">Save Product</Button>
		</form>
	{/if}

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>SKU</TableHead>
					<TableHead>Price</TableHead>
					<TableHead>Stock</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each data.products as product}
					<TableRow>
						<TableCell>{product.name}</TableCell>
						<TableCell>{product.sku}</TableCell>
						<TableCell>${product.price.toFixed(2)}</TableCell>
						<TableCell>{product.stock}</TableCell>
						<TableCell>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={product.id} />
								<Button variant="destructive" size="sm" type="submit">Delete</Button>
							</form>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>