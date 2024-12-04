<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, Package2, Receipt, Settings, LogOut, User } from 'lucide-svelte';
    import { enhance } from '$app/forms'

    export let mode;
</script>


<a
	href="/sales"
	class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page
		.url.pathname.match(/^\/sales/)
		? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
		: ''}"
>
	<Receipt class="h-5 w-5" />
	Sales
</a>
<a
	href="/products"
	class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page.url.pathname.match(/^\/products/) ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50' : ''}"
>
	<Package2 class="h-5 w-5" />
	Products
</a>
{#if mode == 'ADMIN'}
<a
	href="/dashboard"
	class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page
		.url.pathname.match(/^\/dashboard/)
		? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
		: ''}"
>
	<LayoutDashboard class="h-5 w-5" />
	Dashboard
</a>

<a
	href="/users"
	class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page
		.url.pathname.match(/^\/users/)
		? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
		: ''}"
>
	<User class="h-5 w-5" />
	Users
</a>
{/if}

<form class="logout" action="/auth/logout" method="POST" use:enhance>
	<button type="submit" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page
    .url.pathname === '/auth/logout'
    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
    : ''}">
        <LogOut class="h-5 w-5" />
        Log out
    </button>
</form>
