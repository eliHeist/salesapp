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
	import * as Collapsible from '$lib/components/ui/collapsible';

	import NumberField from '$lib/components/custom/numberField/number-field.svelte';

	import SelectCombo from './SelectCombo.svelte';
	import DatePicker from './DatePicker.svelte';

	import { timeSince } from '$lib/stores/TimeSinceStore';

	import { Plus, Trash2, CircleArrowOutUpRight } from 'lucide-svelte';

	import type { Product, SaleBatch } from '@prisma/client';
	import { type CalendarDate, today, getLocalTimeZone } from '@internationalized/date';

	export let data: PageData;

	let showForm = false;

	$: productId = selectedProduct?.id;
	$: stock = selectedProduct?.stock || 0;

	let batchDate: CalendarDate = today(getLocalTimeZone());
	let batchDescription = '';
	let selectedProduct: Product | null = null;
	let quantity = 0;
	let maxQuantity = 0;

	interface SaleInterface {
		productId: number;
		quantity: number;
		total: number;
	}

	let batchSales: SaleInterface[] = [];
	let batchSalesLength: number = 0;

	$: batchSalesString = JSON.stringify(batchSales);

	$: if (selectedProduct) {
		maxQuantity = selectedProduct.stock; // Bind maxQuantity when product is selected
	}

	const addSale = () => {
		if (selectedProduct && quantity > 0) {
			const existingSale = batchSales.find((sale) => sale.productId === selectedProduct?.id);

			if (existingSale) {
                // If the product already exists in the sales list, update its quantity
				existingSale.quantity += quantity;
				existingSale.total = selectedProduct.price * existingSale.quantity; // Recalculate total
                batchSales = [...batchSales];
			} else {
				// Otherwise, add a new sale to the batch
				const newSale = {
					productId: selectedProduct.id,
					quantity,
					total: selectedProduct.price * quantity
				};
				batchSales = [...batchSales, newSale];
			}

			// Reset fields
			selectedProduct = null;
			quantity = 0;
			batchSalesLength = batchSales.length;

			console.log(batchSales);
		}
	};

	function findProductById(productId: number): Product | undefined {
		let prod = data.products.find((p) => p.id === productId);
		return prod;
	}

	function getBatchTotal(batch: any): string {
		let total = 0;
		for (let sale of batch.sales) {
			total += sale.total;
		}
		return total.toLocaleString('en-US');
	}
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
				<form method="POST" action="?/createBatch" use:enhance class="space-y-4">
					<div class="grid gap-2 lg:grid-cols-2">
						<div>
							<Label for="batchDate">Date*</Label>
							<br />
							<DatePicker bind:value={batchDate} />
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
							<NumberField name="" min={1} bind:max={maxQuantity} bind:value={quantity} />
							<Button variant="secondary" type="button" on:click={addSale}>Add Sale</Button>
						</div>

						<div class="mt-4">
							{#if batchSalesLength > 0}
								<Table>
									<TableBody>
										{#each batchSales as sale}
											<TableRow>
												<TableCell>{findProductById(sale.productId)?.name}</TableCell>
												<TableCell class="text-right">{sale.quantity}</TableCell>
												<TableCell class="text-right"
													>{sale.total.toLocaleString('en-US')}</TableCell
												>
												<TableCell>
													<div class="flex justify-end">
														<Button variant="outline" size="iconSm" type="button">
															<Trash2 class="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										{/each}
									</TableBody>
								</Table>
							{:else}
								<p>No sales added yet.</p>
							{/if}
						</div>
					</div>

					<input type="text" class="hidden" name="sales" value={JSON.stringify(batchSales)} />
					<Dialog.Footer class="mt-8">
						<Button type="submit">Create Batch</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<div class="rounded-md border">
		{#if data.saleBatches.length > 0}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Description</TableHead>
						<TableHead class="text-right">Total</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.saleBatches.slice().reverse() as batch}
						<TableRow>
							<TableCell>{batch.date.toLocaleString('en-US', { dateStyle: 'long' })}</TableCell>
							<TableCell>{batch.description}</TableCell>
							<TableCell class="text-right">{getBatchTotal(batch)}</TableCell>
							<TableCell>
								<Button variant="outline" size="iconSm" type="button">
									<CircleArrowOutUpRight class="h-4 w-4" />
								</Button>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		{:else}
			No sales yet
		{/if}
	</div>
</div>
