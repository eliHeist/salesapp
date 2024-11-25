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
    import * as Dialog from '$lib/components/ui/dialog';
    
    import { Plus, ArrowBigRightDash } from "lucide-svelte";
    
	import type { PageData } from './$types';
	import NumberField from '$lib/components/custom/numberField/number-field.svelte';

	export let data: PageData;

	let showForm = false;
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Products</h2>
        <Dialog.Root>
			<Dialog.Trigger>
				<div class="flex items-center">
					<Plus class="mr-2 h-4 w-4" /> Add Product
				</div>
			</Dialog.Trigger>
			<Dialog.Content class="w-full max-w-2xl">
                <form method="POST" action="?/create" use:enhance class="space-y-4 bg-card p-4 rounded-lg">
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="space-y-2 lg:col-span-2">
                            <Label for="name">Name</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="price">Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="stock">Stock</Label>
                            <NumberField id="stock" name="stock" min={0} max={1000000} required />
                        </div>
                        <div class="col-span-2 space-y-2">
                            <Label for="description">Description</Label>
                            <Input id="description" name="description" />
                        </div>
                    </div>
                    <Dialog.Footer>
                        <Button variant="default" type="submit">Save Product</Button>
                    </Dialog.Footer>
                </form>
			</Dialog.Content>
		</Dialog.Root>
	</div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-16">
        <div class="grid gap-2 bg-muted/30 hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg">Total Products</h3>
            <p class="text-6xl font-bold">{data.products.length.toLocaleString("en-US")}</p>
        </div>
        <div class="grid gap-2 bg-muted/30 hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg">Highest Seller</h3>
            <div>
                <p></p>
            </div>
        </div>
        <div class="grid gap-2 bg-muted/30 hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg">Highest Stock</h3>
            <div class="flex gap-x-2">
                <div>
                    <p class="text-6xl font-bold">{data.productWithMostStock.stock.toLocaleString("en-US")}</p>
                </div>
                <div class="grid content-end">
                    <p class="font-semibold">{data.productWithMostStock.name}</p>
                </div>
            </div>
        </div>
        <div class="grid gap-2 bg-muted/30 hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg">Low Stock</h3>
            <div class="flex gap-x-2">
                <div>
                    <p class="text-6xl font-bold">{data.productsOutOfStock.length.toLocaleString("en-US")}</p>
                </div>
                <div class="grid content-end">
                    <p class="font-semibold"></p>
                </div>
            </div>
        </div>
    </div>

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead class="text-right">Price</TableHead>
					<TableHead class="text-right">Stock</TableHead>
					<TableHead class="text-right"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each data.products as product}
					<TableRow>
						<TableCell>{product.name}</TableCell>
						<TableCell class="text-right">{product.price.toLocaleString('en-US')}</TableCell>
						<TableCell class="text-right">{product.stock}</TableCell>
						<TableCell>
                            <div class="flex justify-end gap-2">
                                <a href="/products/{product.id}/">
                                    <Button variant="ghost" size="sm" >
                                        <ArrowBigRightDash class="mr-1 h-4 w-4" />
                                        View
                                    </Button>
                                </a>
                            </div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>