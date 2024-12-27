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
    import { generatePDF } from "$lib/generatePDF";

	import SelectCombo from './SelectCombo.svelte';
	import DatePicker from './DatePicker.svelte';

	import {
		Plus,
		Trash2,
		CircleArrowOutUpRight,
		CircuitBoard,
		Download,
		FileQuestion
	} from 'lucide-svelte';

	import type { Product, SaleBatch } from '@prisma/client';
	import { type CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
	import DetailView from './DetailView.svelte';

	export let data: PageData;

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
		let _continue = true;

		if (!selectedProduct || quantity <= 0) {
			return;
		}
		if (selectedProduct.stock == quantity) {
			_continue = confirm(`This sale will deplete all stocked ${selectedProduct.name} units.`);
		} else if (selectedProduct.stock < quantity) {
			alert(`Quantity selected is greater than the available units of ${selectedProduct.name}.`);
			_continue = false;
		}
		if (!_continue) {
			return;
		}

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
	};

	const removeSale = (id: number) => {
		const existingSale = batchSales.find((sale) => sale.productId === id);

		if (existingSale) {
			batchSales = batchSales.filter((sale) => sale.productId !== id);
			batchSalesLength = batchSales.length;
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

	let form;
	let saleDialogOpen;
	function handleSubmit(response) {
		// add a 1s delay
		setTimeout(() => {
			saleDialogOpen = false;
		}, 500);
	}

    async function getPDF() {
        await generatePDF()
    }
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Sales</h2>
		<Dialog.Root bind:open={saleDialogOpen}>
			<Dialog.Trigger>
				<div tabindex="2" role="button" class="flex items-center" on:click={() => (batchSales = [])}>
					<Plus class="mr-2 h-4 w-4" /> New Sale
				</div>
			</Dialog.Trigger>
			<Dialog.Content class="w-full max-w-2xl">
				<form
					method="POST"
					action="?/createBatch"
					use:enhance
					on:submit={handleSubmit}
					class="space-y-4"
				>
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
						<h3 class="text-xl">Add items to Sale</h3>
						<div class="grid items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							<div class="grid lg:col-span-2">
								<SelectCombo products={data.products} bind:selectedProduct />
							</div>
							<p class="-mt-2 text-sm lg:order-1 lg:col-span-2">
								{#if selectedProduct}
									{selectedProduct.stock} units.
								{:else}
									Product availability.
								{/if}
							</p>
							<NumberField name="" min={0} bind:max={maxQuantity} bind:value={quantity} />
							<Button variant="secondary" type="button" on:click={addSale}>Add Item</Button>
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
														<Button
															variant="outline"
															size="iconSm"
															type="button"
															on:click={() => removeSale(sale.productId)}
														>
															<Trash2 class="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										{/each}
									</TableBody>
								</Table>
							{:else}
								<p>No items added yet.</p>
							{/if}
						</div>
					</div>

					<input type="text" class="hidden" name="sales" value={JSON.stringify(batchSales)} />
					<Dialog.Footer class="mt-8">
						{#if batchSalesLength > 0}
							<Button type="submit">Create Sale</Button>
						{:else}
							<Button variant="ghost" type="button" disabled>Create Sale</Button>
						{/if}
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<div class="grid grid-flow-col gap-4">
		<div class="grid content-start rounded-md border">
			<h2 class="mb-6 mt-4 text-center text-xl font-medium text-muted-foreground">Today</h2>
			{#if data.todaysSales.length > 0}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Items</TableHead>
							<TableHead class="hidden lg:table-cell">Description</TableHead>
							<TableHead class="text-right">Total</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each data.todaysSales.slice().reverse() as batch}
							<TableRow>
								<TableCell>{batch.sales.length}</TableCell>
								<TableCell class="hidden lg:table-cell">{batch.description}</TableCell>
								<TableCell class="text-right">{getBatchTotal(batch)}</TableCell>
								<TableCell>
									<div class="flex justify-end">
										<a href="/sales/{batch.id}/receipt">
											<Button variant="outline" size="iconSm" type="button">
												<Download class="h-4 w-4" />
											</Button>
										</a>
										<Dialog.Root>
											<Dialog.Trigger>
												<Button variant="outline" size="iconSm" type="button">
													<CircleArrowOutUpRight class="h-4 w-4" />
												</Button>
											</Dialog.Trigger>
											<Dialog.Content class="w-full max-w-2xl">
												<div class="flex gap-x-1">
													<span class="font-semibold">Date:</span>
													<p>{batch.date.toLocaleString('en-US', { dateStyle: 'long' })}</p>
												</div>
												<div class="flex gap-x-1">
													<span class="font-semibold">Description:</span>
													<p>{batch.description}</p>
												</div>
												<div class="flex gap-x-1">
													<span class="font-semibold">Total:</span>
													<p>{getBatchTotal(batch)}</p>
												</div>
												<div class="grid gap-2">
													<span class="font-semibold">Items</span>
													<ul>
														{#each batch.sales as sale}
															<li class="flex justify-between">
																<p>
																	{sale.quantity}
																	{findProductById(sale.productId)?.name}
																</p>
																<p>{sale.total.toLocaleString('en-US')}</p>
															</li>
														{/each}
													</ul>
												</div>
											</Dialog.Content>
										</Dialog.Root>
                                        <Button variant="outline" size="iconSm" type="button" on:click={getPDF}>
                                            <Download class="h-4 w-4" />
                                        </Button>
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			{:else}
				<p class="m-auto p-4 text-center">
					<FileQuestion class="mx-auto mb-8 h-20 w-20 opacity-20" />
					No sales today
				</p>
			{/if}
		</div>
		{#if data.earlierSales.length > 0}
			<div class="grid content-start rounded-md border">
				<h2 class="my-4 text-center text-xl font-medium text-muted-foreground">
					Earlier this week
				</h2>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead class="hidden lg:table-cell">Description</TableHead>
							<TableHead class="text-right">Total</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each data.earlierSales.slice().reverse() as batch}
							<TableRow>
								<TableCell>{batch.date.toLocaleString('en-US', { dateStyle: 'long' })}</TableCell>
								<TableCell class="hidden lg:table-cell">{batch.description}</TableCell>
								<TableCell class="text-right">{getBatchTotal(batch)}</TableCell>
								<TableCell>
									<div class="flex justify-end">
										<a href="/sales/{batch.id}/receipt">
											<Button variant="outline" size="iconSm" type="button">
												<Download class="h-4 w-4" />
											</Button>
										</a>
										<Dialog.Root>
											<Dialog.Trigger>
												<Button variant="outline" size="iconSm" type="button">
													<CircleArrowOutUpRight class="h-4 w-4" />
												</Button>
											</Dialog.Trigger>
											<Dialog.Content class="w-full max-w-2xl">
												<div class="flex gap-x-1">
													<span class="font-semibold">Date:</span>
													<p>{batch.date.toLocaleString('en-US', { dateStyle: 'long' })}</p>
												</div>
												<div class="flex gap-x-1">
													<span class="font-semibold">Description:</span>
													<p>{batch.description}</p>
												</div>
												<div class="flex gap-x-1">
													<span class="font-semibold">Total:</span>
													<p>{getBatchTotal(batch)}</p>
												</div>
												<div class="grid gap-2">
													<span class="font-semibold">Items</span>
													<ul>
														{#each batch.sales as sale}
															<li class="flex justify-between">
																<p>
																	{sale.quantity}
																	{findProductById(sale.productId)?.name}
																</p>
																<p>{sale.total.toLocaleString('en-US')}</p>
															</li>
														{/each}
													</ul>
												</div>
											</Dialog.Content>
										</Dialog.Root>
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
				<!-- {:else}
				<p class="m-auto p-4 text-center">
					<FileQuestion class="mx-auto mb-8 h-20 w-20 rotate-45 opacity-20" />
					No sales earlier this week
				</p> -->
			</div>
		{/if}
	</div>
</div>
