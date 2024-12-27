<script lang="ts">
	import { onMount } from 'svelte';

	let chartContainer: HTMLDivElement | null = null;
	export let salesData: any;
	console.log(salesData);

	onMount(() => {
		google.charts.load('current', { packages: ['bar'] });
		google.charts.setOnLoadCallback(drawChart);
	});

	function drawChart() {
		let dataArray = [['Date', 'Customers', 'Items sold']];
		salesData.forEach((day: any) => {
			dataArray.push([formatDate(day.date), day.totalBatches, day.totalSales]);
		});
		const data = (window as any).google.visualization.arrayToDataTable(dataArray);

		const options = {
			chart: {
				subtitle: 'Customers and Items sold: this month'
			},
			bars: 'vertical', // Required for Material Bar Charts
			backgroundColor: 'transparent',
			chartArea: {
				backgroundColor: 'transparent'
			},
            animation: {
                duration: 300,
                easing: 'inAndOut',
                startup: true
            }
		};

		const chart = new (window as any).google.charts.Bar(chartContainer);
		chart.draw(data, (window as any).google.charts.Bar.convertOptions(options));
	}

	function formatDate(dateString) {
		const date = new Date(dateString);

		// Get the day of the week (e.g., "Wed")
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const dayOfWeek = daysOfWeek[date.getDay()];

		// Get the day of the month
		const dayOfMonth = date.getDate();

		// Determine the suffix (st, nd, rd, th)
		let suffix = 'th';
		if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
			suffix = 'st';
		} else if (dayOfMonth === 2 || dayOfMonth === 22) {
			suffix = 'nd';
		} else if (dayOfMonth === 3 || dayOfMonth === 23) {
			suffix = 'rd';
		}

		// Format the date as "Wed. 22nd"
		return `${dayOfWeek}. ${dayOfMonth}${suffix}`;
	}
</script>

<div id="chart-container" class="w-full" bind:this={chartContainer}></div>

<style>
</style>
