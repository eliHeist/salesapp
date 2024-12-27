<script lang="ts">
	import '../../app.scss';
	import { ModeWatcher } from 'mode-watcher';
	import { Menu } from 'lucide-svelte';
	import SideBar from './SideBar.svelte';
    import { Button } from '$lib/components/ui/button';

    let open = false
    export let data;

    let role = 'NORMAL'
    if (data.user) {
        try {
            role = data.user.role
        } catch (error) {
            role = 'NORMAL'
        }
    }
</script>

<div class="h-screen w-screen bg-background">
	<!-- Mobile header -->
	<header class="lg:hidden border-b">
		<div class="container flex gap-x-4 h-16 items-center p-6">
            <Button class="lg:hidden" variant="ghost" type="button" size="icon" on:click={() => {open = true}}>
                <Menu class="h-6 w-6" />
            </Button>
			<span class="font-bold text-lg">Minatrox</span>
		</div>
	</header>

	<div class="lg:grid lg:h-screen [grid-template-columns:auto_1fr] w-screen h-full overflow-hidden">
        <!-- Sidebar -->
        <SideBar user={data.user} bind:open />

		<!-- Main content -->
		<main class="h-full w-full overflow-y-auto">
			<div class="py-5 px-2 sm:px-4 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>

<svelte:head>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</svelte:head>