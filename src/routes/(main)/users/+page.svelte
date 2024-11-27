<script lang="ts">
    import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
    import { Button } from '$lib/components/ui/button';
    import { UserPlus } from 'lucide-svelte';
    
    export let data;
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between ">
        <h2 class="text-3xl font-bold tracking-tight">Products</h2>
        <a href="/auth/register/">
            <Button variant="secondary">
                <UserPlus class="mr-2 h-5 w-5" />
                Add User
            </Button>
        </a>
    </div>
    
    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-16">
        <div class="grid gap-2 bg-muted hover:bg-muted/50 p-6 rounded-lg">
            <h3 class=" font-semibold text-lg">Total Users</h3>
            <p class="text-6xl font-bold">{data.users.length.toLocaleString("en-US")}</p>
        </div>
    </div>
    
    <section>
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each data.users as user}
                        <TableRow>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role.name}</TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
    </section>
</div>