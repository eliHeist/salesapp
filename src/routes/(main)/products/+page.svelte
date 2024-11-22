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
    
    import { PackagePlus, Plus } from "lucide-svelte";
    
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
                                <form class="hidden" method="POST" action="?/delete" use:enhance>
                                    <input type="hidden" name="id" value={product.id} />
                                    <Button variant="destructive" size="sm" type="submit">Delete</Button>
                                </form>
                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        <div class="flex items-center">
                                            <PackagePlus class="mr-2 h-4 w-4" /> Stock in
                                        </div>
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <Dialog.Header>
                                            <Dialog.Title>Add stock for {product.name}.</Dialog.Title>
                                            <Dialog.Description>
                                                The current quantity in stock is {product.stock}.
                                            </Dialog.Description>
                                        </Dialog.Header>
                                        <form method="POST" action="?/stock" use:enhance>
                                            <input type="hidden" name="id" value={product.id} />    
                                            <div class="grid gap-4 py-4">
                                                <div class="grid items-center gap-4">
                                                    <Label for="quantity">Quantity to stock</Label>
                                                    <!-- <Input id="quantity" name="quantity" type="number" min="1" required /> -->
                                                    <NumberField name="quantity" min={1} max={product.stock} />
                                                </div>
                                            </div>
                                            <Dialog.Footer>
                                                <Button type="submit">Save changes</Button>
                                            </Dialog.Footer>
                                        </form>
                                    </Dialog.Content>
                                </Dialog.Root>
                            </div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>