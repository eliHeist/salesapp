<script lang="ts">
    import { onMount } from 'svelte';

    let chart: google.visualization.PieChart | null = null;

    export let totalSales: number = 0;
    export let topSellers: any[] = [];
    // let otherSales: number = totalSales;
    // Data and options for the chart
    const listData = [];

    for (let i = 0; i < topSellers.length; i++) {
        listData.push([topSellers[i].name, topSellers[i]._sum.quantity]);
        // otherSales -= topSellers[i]._sum.quantity;
    }
    // if (otherSales < 0) {
    //     otherSales = 0;
    // }
    // listData.push(['Others', otherSales]);

    const options:any = {
        // title: 'Sales',
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
            data.addColumn('number', 'Sales');
            data.addRows(listData);
            const dataTable = data;
            chart = new google.visualization.PieChart(document.getElementById('sales_piechart_3d'));
            chart.draw(dataTable, options);
        }
    });
</script>

<!-- Chart container -->
<div id="sales_piechart_3d" class="h-full w-full bg-transparent min-h-[300px]"></div>
