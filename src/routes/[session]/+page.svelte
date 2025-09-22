<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import AddItemForm from "$lib/components/AddItemForm.svelte";
    import Daypicker from "$lib/components/Daypicker.svelte";
    import ItemSection from "$lib/components/ItemSection.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const users = $derived(data.users);
    const group = $derived(data.group);

    let editFormOpen = $state(false);
    let currentItem = $state(null);

    function onEdit(item) {
        editFormOpen = true;
        currentItem = item;
    }
</script>

<Modal hasPrompt={false} prompt="" title="Delete Item" bind:open={editFormOpen}>
    <form
        class="w-full flex flex-col"
        action="?/updateItem"
        method="POST"
        use:enhance={() => {
            return async ({ update }) => {
                editFormOpen = false;
                invalidateAll();
                await update();
            };
        }}
    >
        {#if currentItem != null}
            <input type="hidden" name="id" value={currentItem.id} />
            <p>Are you sure you want to delete this item?</p>
            <div class="flex card-actions justify-end">
                <button
                    class="btn btn-ghost btn-sm btn-error"
                    formaction="?/deleteSchedule"
                >
                    Delete
                </button>
            </div>
        {/if}
    </form>
</Modal>

<div class="w-full flex items-center justify-center mt-8 md:mt-16">
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
</div>

<div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start p-8 md:p-16 md:px-32 gap-4"
>
    {#each users as user}
        <div class="card bg-base-100 shadow-sm w-full">
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
                            editCallback={onEdit}
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.monday)}
                            title="Monday"
                            editCallback={onEdit}
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.tuesday)}
                            title="Tuesday"
                            editCallback={onEdit}
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.wednesday)}
                            title="Wednesday"
                            editCallback={onEdit}
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.thursday)}
                            title="Thursday"
                            editCallback={onEdit}
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.friday)}
                            title="Friday"
                            editCallback={onEdit}
                        />
                        <ItemSection
                            items={user.items.filter((item) => item.saturday)}
                            title="Saturday"
                            editCallback={onEdit}
                        />
                    </div>
                {/if}

                <AddItemForm {user} />
            </div>
        </div>
    {/each}
</div>
