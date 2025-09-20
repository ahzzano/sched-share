<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    // let users = $state(data.users);
    const users = $derived(data.users)
</script>

{data.session}

Add Schedule
<div>
    <form
        method="POST"
        action="?/addUser"
        use:enhance={() => {
            return async ({ update, result }) => {
                invalidateAll()
                await update();
            };
        }}
    >
        <input name="username" placeholder="username" />
        <input name="password" type="password" />
        <button>Add User</button>
    </form>
</div>

<div class="grid-cols-3 grid">
    {#each users as user}
        <div>
            <span>{user.name}</span>
        </div>
    {/each}
</div>

