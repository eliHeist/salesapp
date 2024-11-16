<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, Package2, Receipt, Settings } from 'lucide-svelte';
</script>

<a
            href="/"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page.url
                .pathname === '/'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                : ''}"
        >
            <LayoutDashboard class="h-5 w-5" />
            Dashboard
        </a>
        <a
            href="/products"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page.url
                .pathname === '/products'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                : ''}"
        >
            <Package2 class="h-5 w-5" />
            Products
        </a>
        <a
            href="/sales"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page.url
                .pathname === '/sales'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                : ''}"
        >
            <Receipt class="h-5 w-5" />
            Sales
        </a>
        <a
            href="/settings"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 {$page.url
                .pathname === '/settings'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                : ''}"
        >
            <Settings class="h-5 w-5" />
            Settings
        </a>