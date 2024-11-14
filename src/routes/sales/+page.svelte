<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

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
	import * as Dialog from '$lib/components/ui/dialog';
    
    import NumberField from '$lib/components/custom/numberField/number-field.svelte';

	import SelectCombo from './SelectCombo.svelte';
	import DatePicker from './DatePicker.svelte';

	import { Plus } from 'lucide-svelte';

	import type { Product } from '@prisma/client';
    import { type DateValue } from '@internationalized/date';

	export let data: PageData;

	let showForm = false;

	$: productId = selectedProduct?.id;
	$: stock = selectedProduct?.stock || 0;

	let batchDate: DateValue | undefined = undefined;
	let batchDescription = '';
	let sales = [];
	let selectedProduct: Product | null = null;
	let quantity = 0;
	let maxQuantity = 0;

    $: if (selectedProduct) {
		maxQuantity = selectedProduct.stock;  // Bind maxQuantity when product is selected
	}

	const addSale = () => {
        console.log('selectedProduct', selectedProduct);
        console.log('quantity', quantity);
        return
		if (selectedProduct && quantity > 0) {
			sales.push({
				productId: selectedProduct.id,
				productName: selectedProduct.name,
				quantity,
				stock: selectedProduct.stock
			});
			selectedProduct = null;
			quantity = 0;
		}
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Sales</h2>
		<Dialog.Root>
			<Dialog.Trigger>
				<div class="flex items-center">
					<Plus class="mr-2 h-4 w-4" /> New Sale
				</div>
			</Dialog.Trigger>
			<Dialog.Content class="w-full max-w-2xl">
				<form
					method="POST"
					action="?/createBatch"
					use:enhance
					class="space-y-4"
				>
					<div class="grid gap-2 lg:grid-cols-2">
						<div>
                            <Label for="batchDate">Date*</Label>
                            <Input class="hidden" id="batchDate" name="date" type="date" bind:value={batchDate} required />
                            <br>
							<DatePicker />
						</div>
                        <div>
                            <Label for="batchDescription">Description</Label>
                            <Input
                                id="batchDescription"
                                name="description"
                                type="text"
                                bind:value={batchDescription}
                            />
                        </div>
					</div>

					<div class="space-y-4">
						<h3 class="text-xl">Add Sales to Batch</h3>
						<div class="flex gap-4">
							<SelectCombo products={data.products} bind:selectedProduct />
                            <NumberField name="quantity" min={1} bind:max={maxQuantity} bind:value={quantity} />
							<Input
								type="number"
								bind:value={quantity}
								min="1"
								max={selectedProduct?.stock || 1}
								placeholder="Quantity"
							/>
							<Button type="button" on:click={addSale}>Add Sale</Button>
						</div>

						{#if sales.length > 0}
							<div class="mt-4">
								<h4 class="text-lg">Sales in this Batch</h4>
								<ul>
									{#each sales as sale}
										<li>{sale.productName} - Quantity: {sale.quantity}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					<input type="hidden" name="sales" value={JSON.stringify(sales)} />
					<Button type="submit">Create Batch</Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	{#if showForm}
		<form
			method="POST"
			action="?/create"
			use:enhance
			class="space-y-4 rounded-lg border bg-card p-4"
		>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="productId">Product</Label>
					<br />
					<SelectCombo products={data.products} bind:selectedProduct />
					<input type="text" class="hidden" name="productId" bind:value={productId} required />
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
