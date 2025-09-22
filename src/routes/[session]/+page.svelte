<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import AddItemForm from "$lib/components/AddItemForm.svelte";
    import ItemSection from "$lib/components/ItemSection.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const users = $derived(data.users);
    const group = $derived(data.group);
</script>

<div
    class="flex flex-col md:flex-row gap-2 w-full items-center justify-start md:p-12 p-8"
>
    <div class="flex flex-col text-center md:text-left">
        {#if group.name}
            <span class="text-2xl">{group.name}</span>
        {:else}
            <span class="text-2xl">No Group Name</span>
        {/if}

        <span> Add someone's schedule here </span>
    </div>

    <form
        method="POST"
        action="?/addUser"
        class="md:ml-auto w-full md:w-128"
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
                class="input"
            />
            <button class="btn">Add User</button>
        </div>
    </form>
</div>

<div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start p-8 md:p-12 gap-4"
>
    {#each users as user}
        <div class="card bg-base-100 shadow-sm w-full lg:w-90">
            <div class="card-body">
                <div class="card-title">
                    <span class="grow-1">{user.name}</span>
                    <form
                        action="?/deleteUser"
                        method="POST"
                        use:enhance={() => {
                            return async ({ update }) => {
                                invalidateAll();
                                await update();
                            };
                        }}
                    >
                        <input type="hidden" name="id" value={user.id} />
                        <button
                            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                class="w-4 h-4"
                                ><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                                    d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"
                                /></svg
                            >
                        </button>
                    </form>
                </div>

                {#if user.items.length == 0}
                    <div class="">No items to be found</div>
                {:else}
                    <div class="join join-vertical">
                        <ItemSection
                            items={user.items.filter((item) => item.sunday)}
                            title="Sunday"
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.monday)}
                            title="Monday"
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.tuesday)}
                            title="Tuesday"
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.wednesday)}
                            title="Wednesday"
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.thursday)}
                            title="Thursday"
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.friday)}
                            title="Friday"
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.saturday)}
                            title="Saturday"
                        />
                    </div>
                {/if}

                <AddItemForm {user} />
            </div>
        </div>
    {/each}
</div>
