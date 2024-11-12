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
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import type { PageData } from './$types';

	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/';
	import * as Popover from '$lib/components/ui/popover/';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	export let data: PageData;

	let showForm = false;

    // combobox
    let open = false;
    let value = "";
    let productId: string = '';
    
    let selectedValue: any = {name: null, stock: 0};
    
    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
        document.getElementById(triggerId)?.focus();
        });
    }
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Sales</h2>
		<Button on:click={() => (showForm = !showForm)}>
			{showForm ? 'Cancel' : 'New Sale'}
		</Button>
	</div>

	{#if showForm}
		<form method="POST" action="?/create" use:enhance class="space-y-4 rounded-lg bg-card p-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="productId">Product</Label>
					<Input name="productId" value={value} required class="hidden" />
                    <br>
					<Popover.Root bind:open let:ids>
						<Popover.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="outline"
								role="combobox"
								aria-expanded={open}
								class="w-[200px] justify-between"
							>
								{selectedValue.name || 'Select a product'}
								<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-[200px] p-0">
							<Command.Root>
								<Command.Input placeholder="Search products..." />
								<Command.Empty>No products found.</Command.Empty>
								<Command.Group>
									{#each data.products as product}
										<Command.Item
											value={product.id.toString()}
											onSelect={(currentValue) => {
												value = currentValue;
                                                selectedValue = product;
												closeAndFocusTrigger(ids.trigger);
											}}
										>
											<Check
												class={cn('mr-2 h-4 w-4', value != product.id.toString() && 'text-transparent')}
											/>
											{product.name}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
				<div class="space-y-2">
					<Label for="quantity">Quantity</Label>
					<Input id="quantity" name="quantity" type="number" min="1" max={selectedValue.stock} required />
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
						<TableCell>${sale.total.toFixed(2)}</TableCell>
						<TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
