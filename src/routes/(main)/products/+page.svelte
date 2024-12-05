<script lang="ts">
	import { enhance } from '$app/forms';

	import { Button } from '$lib/components/ui/button';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import * as Dialog from '$lib/components/ui/dialog';
    
    import { Plus, ArrowBigRightDash } from "lucide-svelte";
    
	import type { PageData } from './$types';
	import NumberField from '$lib/components/custom/numberField/number-field.svelte';

    
    interface FormData { 
        name: string; 
        price: number; 
        stock: number; 
        description?: string; 
    }

	export let data: PageData;

    let products = data.products

    // console.log(data, products)


	let showForm = false;
    let errorMessage = '';

    async function handleSubmit(event: Event) {
        event.preventDefault()
        const formElement = event.target as HTMLFormElement; 
        const formData = new FormData(formElement); // Get the form data 

        // Convert formData to a JSON object 
        let data: FormData = { 
            name: formData.get('name')?.toString() || '', 
            price: parseFloat(formData.get('price')?.toString() || '0'), 
            stock: parseInt(formData.get('stock')?.toString() || '0'), 
            description: formData.get('description')?.toString() || '' 
        }; 

        console.log(data)

        // Validate data before sending it to the server 
        if (!data.name) { 
            errorMessage = 'Name is required'; 
            return; 
        } 
        if (data.price === undefined || isNaN(data.price)) { 
            errorMessage = 'Price is required and must be a number';
            return; 
        }
        
        try { 
            const response = await fetch('/api/products/', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(data) 
            }); 
            
            const result = await response.json(); 
            
            if (response.ok) { 
                showForm = false;
                products = [result.product, ...products]
            } else { 
                errorMessage = result.error; 
                console.error(errorMessage); 
            } 
        } catch (error) { 
            console.error('Error:', error); 
            errorMessage = 'An unexpected error occurred'; 
        }
    }

    let unitsSold = 0
    if (data.productWithMostSales) {
        data.productWithMostSales.sales.forEach(sale => {
            unitsSold += sale.quantity
        });
    }

    let role = 'NORMAL'
    if (data.user) {
        try {
            role = data.user.role
        } catch (error) {
            role = 'NORMAL'
        }
    }
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Products</h2>
        {#if role == 'ADMIN'}
        <Dialog.Root bind:open={showForm}>
			<Dialog.Trigger>
				<div class="flex items-center">
					<Plus class="mr-2 h-4 w-4" /> Add Product
				</div>
			</Dialog.Trigger>
			<Dialog.Content class="w-full max-w-2xl">
                <form use:enhance on:submit={handleSubmit} class="space-y-4 bg-card p-4 rounded-lg">
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
        {/if}
	</div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-16">
        <div class="grid gap-2 bg-muted hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg text-muted-foreground">Total Products</h3>
            {#if data.products}
            <p class="text-6xl font-bold">{data.products.length.toLocaleString("en-US")}</p>
            {/if}
        </div>
        <div class="grid gap-2 bg-muted hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg text-muted-foreground">Highest Seller</h3>
            {#if data.productWithMostSales}
            <div class="flex gap-x-2">
                <div>
                    <p class="text-6xl font-bold">{data.productWithMostSales.sales.length.toLocaleString("en-US")}</p>
                </div>
                <div class="grid content-center">
                    <p class="font-semibold">{data.productWithMostSales.name}</p>
                    <p class="text-muted-foreground">{unitsSold.toLocaleString("en-US")} units sold</p>
                </div>
            </div>
            {/if}
        </div>
        <div class="grid gap-2 bg-muted hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg text-muted-foreground">Highest Stock</h3>
            {#if data.productWithMostStock}
            <div class="flex gap-x-2">
                <div>
                    <p class="text-6xl font-bold">{data.productWithMostStock.stock.toLocaleString("en-US")}</p>
                </div>
                <div class="grid content-end">
                    <p class="font-semibold">{data.productWithMostStock.name}</p>
                </div>
            </div>
            {/if}
        </div>
        <div class="grid gap-2 bg-muted hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg text-muted-foreground">Low Stock</h3>
            <div class="flex gap-x-2">
                <div>
                    {#if data.productsOutOfStock}
                    <p class="text-6xl font-bold">{data.productsOutOfStock.length.toLocaleString("en-US")}</p>
                    {/if}
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
				{#each products as product}
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