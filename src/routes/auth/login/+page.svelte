<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from "$lib/components/ui/label";

	let { form } = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>Login to your account.</Card.Description>
    </Card.Header>
    <form action="?/login" method="POST">
        <Card.Content class="grid gap-4 min-w-[500px]">
            <div>
                <Label for="username">Username</Label>
                <Input id="username" name="username" type="text" required />
            </div>
            <div>
                <Label for="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            {#if form?.invalid}
                <p class="error">Username and password is required.</p>
            {/if}
        </Card.Content>
        <Card.Footer>
            <Button type="submit">Log in</Button>
        </Card.Footer>
    </form>
</Card.Root>
