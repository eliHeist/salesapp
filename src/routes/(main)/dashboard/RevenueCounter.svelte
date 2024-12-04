<script lang="ts">
    export let totalRevenue;

    let countUpValue = 0;
    // increment countUpValue by 50 every 100ms until it reaches totalRevenue
    let interval = setInterval(() => {
        const increment = (totalRevenue/100)*10;
        if ((countUpValue + increment) > totalRevenue) {
            countUpValue = totalRevenue;
            // destroy the interval
            clearInterval(interval);
        }
        else if (countUpValue < totalRevenue) {
            countUpValue += increment;
        }
    }, 40);

    $: lastDigits = countUpValue.toString().slice(-3);
    $: firstDigits = countUpValue.toString().slice(0, -3);
    console.log(firstDigits)
</script>

<div class="font-semibold flex gap-x-2">
    <span class="my-auto opacity-80 text-green-600">UGX</span> 
    <span class="2xl:text-8xl xl:text-7xl lg:text-6xl md:text-5xl text-4xl font-bold">{Number(firstDigits).toLocaleString('en-US')}</span>
    <span class="text-xl font-semibold mt-auto">{lastDigits}</span>
</div>
