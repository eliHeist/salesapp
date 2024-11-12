<script lang="ts">
	import '../app.scss';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import { LayoutDashboard, Package2, Receipt, Settings, Menu } from 'lucide-svelte';
</script>

<ModeWatcher />

<div class="min-h-screen bg-background">
	<!-- Mobile header -->
	<header class="lg:hidden border-b">
		<div class="container flex h-16 items-center px-4">
			<button class="mr-4">
				<Menu class="h-6 w-6" />
			</button>
			<span class="font-bold text-lg">Stock Manager</span>
		</div>
	</header>

	<div class="flex">
		<!-- Sidebar -->
		<aside class="hidden lg:flex h-screen w-64 flex-col fixed left-0 border-r">
			<div class="p-6">
				<h1 class="font-bold text-2xl">Stock Manager</h1>
			</div>
			<nav class="flex-1 space-y-2 p-4">
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
			</nav>
		</aside>

		<!-- Main content -->
		<main class="flex-1 lg:ml-64">
			<div class="container py-5 px-4 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>