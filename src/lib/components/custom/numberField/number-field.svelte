<script lang="ts">
    import { Plus, Minus } from "lucide-svelte";

    export let name: string;
    export let value: number = 0;
    export let min: number = 0;
    export let max: number = 100;
    export let required: boolean = false;
    export let id: string = "";
</script>

<div class="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 ring-offset-background transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-offset-2" >
	<button class="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
    on:click={() => value--}
    type="button"
    >
		<Minus size={16} strokeWidth={2} aria-hidden="true" />
	</button>
	<input
		class="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
        bind:value
        inputmode="numeric"
        type="number"
        name={name}
        min={min}
        max={max}
        id={id}
        {required}
	/>
	<button class="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
    on:click={() => value++}
    type="button"
    >
		<Plus size={16} strokeWidth={2} aria-hidden="true" />
	</button>
</div>

<style lang="scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        appearance: none;
        margin: 0;
    }

    input[type=number]{
        appearance: textfield;
    }
</style>
