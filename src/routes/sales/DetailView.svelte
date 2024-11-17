<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { CircleArrowOutUpRight } from 'lucide-svelte';

	import type { Product } from '@prisma/client';

	export let batch: any;

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
