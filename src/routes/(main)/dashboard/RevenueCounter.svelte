<script lang="ts">
    export let totalRevenue = 0;

    let countUpValue = 0;
    // increment countUpValue by 50 every 100ms until it reaches totalRevenue
    let interval = setInterval(() => {
        const increment = (totalRevenue/100)*1;
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
</script>

<div class="font-semibold flex gap-x-2">
    <span class="my-auto opacity-80 text-green-600">UGX</span> 
    <span class="text-8xl font-bold">{firstDigits}</span>
    <span class="text-xl font-semibold mt-auto">{lastDigits}</span>
</div>
