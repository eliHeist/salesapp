<script lang="ts">
    import type { PageData } from './$types';
    import type { Product, SaleBatch } from '@prisma/client';

    import { Button } from '$lib/components/ui/button';
    import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
    import * as Dialog from '$lib/components/ui/dialog';

    import {
		Plus,
		Trash2,
		CircleArrowOutUpRight,
		CircuitBoard,
		Download,
		FileQuestion
	} from 'lucide-svelte';

    function getBatchTotal(batch: any): string {
		let total = 0;
		for (let sale of batch.sales) {
			total += sale.total;
		}
		return total.toLocaleString('en-US');
	}

    function findProductById(productId: number): Product | undefined {
		let prod = data.products.find((p) => p.id === productId);
		return prod;
	}

    export let data: PageData;
</script>

<div class="grid content-start rounded-md border">
    <h2 class="my-4 text-center text-xl font-medium text-muted-foreground">
        All sales
    </h2>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead class="hidden lg:table-cell">Description</TableHead>
                <TableHead class="hidden lg:table-cell text-center">Items</TableHead>
                <TableHead class="text-right">Total</TableHead>
                <TableHead></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {#each data.sales.slice().reverse() as batch}
                <TableRow>
                    <TableCell>{batch.date.toLocaleString('en-US', { dateStyle: 'long' })}</TableCell>
                    <TableCell class="hidden lg:table-cell">{batch.description}</TableCell>
                    <TableCell class="hidden lg:table-cell text-center">{batch.sales.length}</TableCell>
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
</div>