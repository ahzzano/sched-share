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

<div class="flex gap-2 w-full items-center justify-start md:p-12 p-8">
    {#if group.name}
        <span class="text-2xl">{group.name}</span>
    {:else}
        <span class="text-2xl">No Group Name</span>
    {/if}

    <span> Add someone's schedule here </span>

    <form
        method="POST"
        action="?/addUser"
        class="ml-auto w-128"
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

<div class="grid grid-cols-1 md:grid-cols-3 items-start p-8 md:p-12 gap-4">
    {#each users as user}
        <div class="card bg-base-100 shadow-sm md:w-128">
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
                        <button>Delete</button>
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
