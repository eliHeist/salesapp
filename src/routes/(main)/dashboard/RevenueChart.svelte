<script lang="ts">
    import { onMount } from 'svelte';

    let chart: google.visualization.PieChart | null = null;

    export let totalRevenue: number = 0;
    export let topRevenuers: any[] = [];
    let otherRevenue: number = totalRevenue;
    // Data and options for the chart
    const listData = [];

    for (let i = 0; i < topRevenuers.length; i++) {
        listData.push([topRevenuers[i].name, topRevenuers[i]._sum.total]);
        otherRevenue -= topRevenuers[i]._sum.total;
    }
    listData.push(['Others', otherRevenue]);

    const options:any = {
        // title: 'Revenue Chart',
        is3D: true,
        pieHole: 0.4,
        legend: 'none',
        backgroundColor: 'transparent',
        chartArea: {
            width: '90%',
            height: '90%'
        },
        pieSliceText: 'label',
        sliceVisibilityThreshold: .10
    };

    onMount(() => {
        // Load the Google Charts library
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Product');
            data.addColumn('number', 'Revenue');
            data.addRows(listData);
            const dataTable = data;
            chart = new google.visualization.PieChart(document.getElementById('revenue_piechart_3d'));
            chart.draw(dataTable, options);
        }
    });
</script>

<!-- Chart container -->
<div id="revenue_piechart_3d" class="w-full h-full bg-transparent min-h-[300px]"></div>
