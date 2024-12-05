<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import NumberField from '$lib/components/custom/numberField/number-field.svelte';

	import { PackagePlus, Blocks, Trash2, Edit } from 'lucide-svelte';

	export let data: PageData;
	console.log(data.product);

	let pdt = data.product;

    let errorMessage = '';

    async function handleDelete(event: Event) {
        event.preventDefault(); // Prevent the default form submission
        const formElement = event.target as HTMLFormElement;
        const formData = new FormData(formElement); // Get the form data

        // Convert formData to a JSON object
        const data = {
            id: formData.get('id')?.toString() || ''
        };

        try {
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.success);
                await goto('/products'); // Use goto for client-side navigation
            } else {
                errorMessage = result.error;
                console.error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage = 'An unexpected error occurred';
        }
    }
</script>

<section class="py-4">
	<div class="mb-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<div class="grid gap-2 rounded-lg bg-muted/30 p-6 hover:bg-muted/50">
			<h3 class="text-sm font-semibold text-muted-foreground">Product</h3>
			<p class="text-xl">{data.product.name}</p>
			{#if data.product.description}
				<p class="text-sm text-muted-foreground">{data.product.description}</p>
			{/if}
		</div>
		<div class="grid gap-2 rounded-lg bg-muted/30 p-6 hover:bg-muted/50">
			<h3 class="text-sm font-semibold text-muted-foreground">Price</h3>
			<p>UGX <span class="text-3xl font-semibold">{data.product.price.toLocaleString('en-US')}</span></p>
		</div>
		<div class="grid gap-2 rounded-lg bg-muted/30 p-6 hover:bg-muted/50">
			<h3 class="text-sm font-semibold text-muted-foreground">Stock</h3>
			<p class="text-3xl font-semibold">{data.product.stock.toLocaleString('en-US')}</p>
		</div>
		<div class="grid gap-2 rounded-lg bg-muted/30 p-6 hover:bg-muted/50">
			<h3 class="text-sm font-semibold text-muted-foreground">Sales</h3>
			<p class="text-3xl font-semibold">{data.product.sales.length.toLocaleString('en-US')}</p>
		</div>
	</div>

	{#if data.user.role == 'ADMIN'}
		<h2 class="flex items-center gap-4 text-2xl font-bold">
			<Blocks class="h-6 w-6" />
			Actions
		</h2>
		<div class="actions grid gap-8 py-6 sm:flex">
			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="outline" size="lg">
						<Trash2 class="mr-2 h-4 w-4" /> Delete Product
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<p class="text-lg font-semibold">
						Are you sure you want to delete {pdt.name}, <br>this will alter all the sales of this product.
					</p>
					<form on:submit={handleDelete}>
						<input type="hidden" name="id" value={data.product.id} />
						<Button variant="destructive" size="lg" type="submit">
							<Trash2 class="mr-2 h-4 w-4" />
							Delete
						</Button>
					</form>
				</Dialog.Content>
			</Dialog.Root>
			<Dialog.Root>
				<Dialog.Trigger>
					<Button
						variant="outline"
						size="lg"
						on:click={() => {
							pdt = data.product;
						}}
					>
						<Edit class="mr-2 h-4 w-4" /> Edit product details
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="w-full max-w-2xl">
					<form
						method="POST"
						action="?/update"
						use:enhance
						class="space-y-4 rounded-lg bg-card p-4"
					>
						<input type="text" value={pdt.id} class="hidden" name="id" />
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div class="space-y-2 lg:col-span-2">
								<Label for="name">Name</Label>
								<Input id="name" name="name" value={pdt.name} required />
							</div>
							<div class="space-y-2">
								<Label for="price">Price</Label>
								<Input
									id="price"
									name="price"
									type="number"
									value={pdt.price}
									step="0.01"
									required
								/>
							</div>
							<div class="space-y-2">
								<Label for="stock">Stock</Label>
								<NumberField
									id="stock"
									name="stock"
									min={0}
									max={1000000}
									value={pdt.stock}
									required
								/>
							</div>
							<div class="col-span-2 space-y-2">
								<Label for="description">Description</Label>
								<Input id="description" name="description" value={pdt.description} />
							</div>
						</div>
						<Dialog.Footer>
							<Button variant="default" size="lg" type="submit">Update Product</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="outline" size="lg">
						<PackagePlus class="mr-2 h-4 w-4" /> Stock in
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Add stock for {data.product.name}.</Dialog.Title>
						<Dialog.Description>
							The current quantity in stock is {data.product.stock}.
						</Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/stock" use:enhance>
						<input type="hidden" name="id" value={data.product.id} />
						<div class="grid gap-4 py-4">
							<div class="grid items-center gap-4">
								<Label for="quantity">Quantity to stock</Label>
								<!-- <Input id="quantity" name="quantity" type="number" min="1" required /> -->
								<NumberField name="quantity" min={1} max={data.product.stock} />
							</div>
						</div>
						<Dialog.Footer>
							<Button type="submit">Save changes</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/if}
</section>
