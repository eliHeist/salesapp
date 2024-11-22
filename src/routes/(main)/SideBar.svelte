<script lang="ts">
	import { X } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
	import SideBarNav from './SideBarNav.svelte';

    export let open = false
</script>

<aside class="hidden lg:flex h-screen w-64 flex-col fixed left-0 border-r">
    <div class="p-6 flex items-center justify-center">
        <h1 class="font-bold text-2xl">Minatrox</h1>
    </div>
    <nav class="flex-1 space-y-2 p-4">
        <SideBarNav />
    </nav>
</aside>


<aside class="lg:hidden h-screen fixed grid items-start content-start left-0 top-0 border-r bg-background min-w-80 z-10 transition-transform {open ? 'translate-x-0' : '-translate-x-full'}">
    <div class="p-6 flex items-center justify-between w-full">
        <!-- close button for mobile -->
        <Button class="lg:hidden { open ? 'scale-100' : 'scale-0' } transition-all delay-300" variant="ghost" type="button" size="icon" on:click={() => {open = false}}>
            <X class="h-5 w-5" />
        </Button>
        <h1 class="font-bold text-2xl">Minatrox</h1>
    </div>
    <nav class="flex-1 space-y-2 p-4">
        <SideBarNav />
    </nav>
</aside>