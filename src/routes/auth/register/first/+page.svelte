<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from "$lib/components/ui/label";
    
	let { form } = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Register</Card.Title>
        <Card.Description>Register a new user.</Card.Description>
    </Card.Header>
    <form action="?/register" method="POST">
        <Card.Content class="grid gap-4 md:grid-cols-2">
            <div>
                <Label for="username">Username *</Label>
                <Input id="username" name="username" type="text" required />
            </div>
            <div>
                <Label for="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" type="full_name" required />
            </div>
            <div>
                <Label for="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
            </div>
            <div>
                <Label for="password">Password *</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            {#if form?.user}
                <p class="error">Username is taken.</p>
            {/if}
        </Card.Content>
        <Card.Footer>
            <Button type="submit">Register</Button>
        </Card.Footer>
    </form>
</Card.Root>

