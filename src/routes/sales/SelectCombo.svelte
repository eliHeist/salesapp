<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
    import { Search } from "lucide-svelte";
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Popover from '$lib/components/ui/popover/';
	import { Button } from '$lib/components/ui/button/';
	import { tick } from 'svelte';
    import type { Product } from '@prisma/client';


    export let products: Product[] = [];
    export let selectedProduct: Product | null = null;

	let open = false;
	let value = '';
    let search = '';

	$: selectedValue = products.find((product) => product.id.toString() === value)?.name ?? 'Select a product...';

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

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<div class="flex items-center px-2 border-b">
            <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input type="text" class="flex-1 outline-none bg-transparent text-sm placeholder:text-muted-foreground h-11 w-full rounded-md py-3" bind:value={search} placeholder="Select a product..." />
        </div>
        <div class="p-1">
            <ul class="grid">
                {#each products as product}
                    {#if product.name.toLowerCase().includes(search.toLowerCase())}
                    <button type="button" class="aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent"
                        on:click={() => {
                            value = product.id.toString();
                            selectedProduct = product;
                            closeAndFocusTrigger(ids.trigger);
                        }}>
                        <Check class="h-4 w-4 mr-2 {product.id.toString() !== value ? 'opacity-0' : ''}" />
                        
                        {product.name}
                    </button>
                    {/if}
                {/each}
            </ul>
        </div>
	</Popover.Content>
</Popover.Root>

