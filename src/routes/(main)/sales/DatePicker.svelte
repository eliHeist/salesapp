<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, type CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	export let value: CalendarDate = today(getLocalTimeZone());

    export let name: string = "date"

    let open: boolean = false

    function toggleCalendar() {
        open = !open
    }
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
        <input type="date" {name} class="hidden" bind:value>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar onValueChange={toggleCalendar} maxValue={today(getLocalTimeZone())} bind:value initialFocus />
	</Popover.Content>
</Popover.Root>
