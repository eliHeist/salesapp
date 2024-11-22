<script lang="ts">
	import '../../app.scss';
	import { ModeWatcher } from 'mode-watcher';
	import { Menu } from 'lucide-svelte';
	import SideBar from './SideBar.svelte';
    import { Button } from '$lib/components/ui/button';

    let open = false
</script>

<ModeWatcher />

<div class="min-h-screen bg-background">
	<!-- Mobile header -->
	<header class="lg:hidden border-b">
		<div class="container flex gap-x-4 h-16 items-center p-6">
            <Button class="lg:hidden" variant="ghost" type="button" size="icon" on:click={() => {open = true}}>
                <Menu class="h-6 w-6" />
            </Button>
			<span class="font-bold text-lg">Minatrox</span>
		</div>
	</header>

	<div class="flex">
		<!-- Sidebar -->
		<SideBar bind:open />

		<!-- Main content -->
		<main class="flex-1 lg:ml-64">
			<div class="container py-5 px-4 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>