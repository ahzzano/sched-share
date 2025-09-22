<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import AddItemForm from "$lib/components/AddItemForm.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const users = $derived(data.users);
    const group = $derived(data.group);
    const allItems = $derived(data.items);
    const slots = $derived(data.slots);
</script>

<div class="w-full flex items-center justify-center mt-8 md:mt-16 gap-4">
    <div class="card shadow-sm rounded-2xl">
        <div class="card-body">
            <div class="flex flex-col text-left">
                {#if group.name}
                    <span class="text-2xl card-title">{group.name}</span>
                {:else}
                    <span class="text-2xl card-title">No Group Name</span>
                {/if}

                <span> Add someone's schedule here </span>
            </div>

            <form
                method="POST"
                action="?/addUser"
                class="w-full md:w-128"
                use:enhance={() => {
                    return async ({ update, result }) => {
                        invalidateAll();
                        await update();
                    };
                }}
            >
                <div class="join w-full">
                    <input
                        name="username"
                        placeholder="Username: Don Pedro"
                        class="input w-full"
                    />
                    <button class="btn">Add User</button>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm rounded-2xl">
        <div class="card-body">
            {#each users as user}
                <span>{user.name}</span>
                <AddItemForm {user} />
            {/each}
        </div>
    </div>
</div>

<div class="w-full p-32">
    <div class="grid grid-cols-8">
        <span>Time Slot</span>
        {#each ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as day}
            <span>{day}</span>
        {/each}
        {#each slots as slot}
            <div class="col-1">
                {slot.getHours()}:{slot.getMinutes()}
            </div>
        {/each}

        {#each allItems as item}
            {#each [0, 1, 2, 3, 4, 5, 6] as i}
                {#if item.days[i]}
                    <div class="col-{i + 2}">
                        {item.name}
                    </div>
                {/if}
            {/each}
        {/each}
    </div>
</div>
