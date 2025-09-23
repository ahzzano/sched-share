<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import AddItemForm from "$lib/components/AddItemForm.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const users = $derived(data.users);
    const group = $derived(data.group);
    const slots = $derived(data.slots);
    const everyOtherSlot = $derived(slots.filter((_, i) => i % 2 == 0));
    const groups = $derived(data.groups);

    function findUser(id: number) {
        return users.find((user) => user.id == id);
    }
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

<div class="w-full py-16 px-32">
    <div class="grid grid-cols-8 gap-2 mb-4">
        <span>Time Slot</span>
        {#each ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as day}
            <span class="text-center">{day}</span>
        {/each}
    </div>
    <div
        class="grid grid-cols-8 gap-x-2 [grid-template-rows:repeat(30,1.5em)] bg-calendar-lines relative"
    >
        {#each everyOtherSlot as slot, i}
            <div
                class="col-1 row-span-2 w-full h-full"
                style="
                grid-row-start: {2 * i + 1};
            "
            >
                {slot.getHours()}:{slot
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}
            </div>
        {/each}

        {#each groups as group, col}
            {#each group as slot, i}
                <div
                    class="bg-green-100 rounded"
                    style="
                        grid-column: {col + 1};
                        grid-row-start: {slot.start + 1}; 
                        grid-row-end: {slot.end + 2};"
                >
                    <div class="p-2">
                        {#each slot.items as item}
                            <div>
                                {findUser(item.user).name}
                                {item.name}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        {/each}
    </div>
</div>

<style>
    .bg-calendar-lines {
        z-index: 0;
        background-image: repeating-linear-gradient(
            to bottom,
            #e5e7eb 0px 1px,
            transparent 1px 1.5em
        );
        pointer-events: none;
    }
</style>
