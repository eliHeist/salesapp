<script lang="ts">
	import { X, UserCheck } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import SideBarNav from './SideBarNav.svelte';
	import Logo from '$lib/components/logo.svelte';

	export let open = false;
	export let user;
	export let mode = 'NORMAL';
    if (user) {
        try {
            mode = user.role
        } catch (error) {
            mode = 'NORMAL'
        }
    }
</script>

<aside class="fixed left-0 hidden h-screen w-64 flex-col border-r lg:flex">
	<div class="flex items-center justify-center p-6">
		<h1 class="hidden">Minatrox</h1>
		<Logo />
	</div>
	<nav class="flex-1 space-y-2 p-4">
		<SideBarNav {mode} />
	</nav>
	<div class="p-4">
		<div class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500">
            {#if user}
			<div class="rounded-full h-6 w-6">
                <UserCheck class="text-green-500" />
            </div>
            <div class="grid">
                <span class="text-sm">{user.full_name}</span>
                <span class="text-xs">@{user.username}</span>
            </div>
            {/if}
		</div>
	</div>
</aside>

<aside
	class="fixed left-0 top-0 z-10 grid h-screen min-w-80 content-start items-start border-r bg-background transition-transform lg:hidden {open
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="flex w-full items-center justify-between p-6">
		<!-- close button for mobile -->
		<Button
			class="lg:hidden {open ? 'scale-100' : 'scale-0'} transition-all delay-300"
			variant="ghost"
			type="button"
			size="icon"
			on:click={() => {
				open = false;
			}}
		>
			<X class="h-5 w-5" />
		</Button>
		<h1 class="text-2xl font-bold">Minatrox</h1>
	</div>
	<nav class="flex-1 space-y-2 p-4">
		<SideBarNav />
	</nav>
</aside>
