<script lang="ts">
	import { enhance } from "$app/forms";

	import type { PageData, ActionData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>

<header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
</header>
<main>
	<h1>Settings</h1>
</main>
