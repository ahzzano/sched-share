<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import AddItemForm from "$lib/components/AddItemForm.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import type { User } from "$lib/server/db/schema";
    import { type ParsedItem, type UserWithItems } from "$lib/types";
    import { SELECTED_DAYS } from "../../types";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const users = $derived(data.users);
    const group = $derived(data.group);
    const slots = $derived(data.slots);
    const idToName = $derived(data.idToName);
    const everyOtherSlot = $derived(slots.filter((_, i) => i % 2 == 0));
    const groups = $derived(data.groups);

    let openGroupModal = $state(false);

    let viewableDay = $state(SELECTED_DAYS.ALL);
    let selectedDay = $state(SELECTED_DAYS.SUNDAY);

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    let openItems: ParsedItem[] = $state([]);
    // const openUsers = $derived.by(() => {
    //     let toRet = new Set();
    //     for (const item of openItems) {
    //         const userId = item.user;
    //         toRet.add(idToName.get(userId));
    //     }
    //
    //     return Array.from(toRet);
    // });
    let openUsers: User[] = $state([])

    let isMobile = $state(false);

    $effect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const update = () => (isMobile = mediaQuery.matches);
        update(); // initial

        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    });

    $effect(() => {
        if (!isMobile) {
            viewableDay = SELECTED_DAYS.ALL;
        } else {
            viewableDay = selectedDay;
        }
    });
</script>

<Modal title="Colliding Schedules" bind:open={openGroupModal}>
    <div class="flex gap-2 flex-col">
        {#each openUsers as user}
            <div
                class="collapse collapse-arrow bg-base-100 border border-base-300"
            >
                <input type="checkbox" name="accordion" checked={false} />
                <div class="collapse-title font-semibold">{user.name}</div>
                <div class="collapse-content">
                    {#each openItems.filter((item) => item.user == user.id) as item}
                        <div class="w-full flex items-center">
                            <div
                                class="w-1/2 flex gap-3 justify-start items-center"
                            >
                                <span class="w-2/3">{item.name}</span>
                                <form
                                    action="?/deleteSchedule"
                                    method="POST"
                                    use:enhance={() => {
                                        return async ({ update }) => {
                                            openGroupModal = false;
                                            await update();
                                            invalidateAll();
                                        };
                                    }}
                                >
                                    <input value={item.id} name="id" hidden />
                                    <button
                                        class="w-10 hover:bg-red-200 p-2 rounded"
                                        aria-label="delete-item"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 640 512"
                                            class="w-6"
                                            ><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                                                d="M136.4 128a120 120 0 1 1 240 0 120 120 0 1 1 -240 0zm-88 354.3c0-98.5 79.8-178.3 178.3-178.3l59.4 0c98.5 0 178.3 79.8 178.3 178.3 0 16.4-13.3 29.7-29.7 29.7L78.1 512c-16.4 0-29.7-13.3-29.7-29.7zM612.3 124.1c9.4 9.4 9.4 24.6 0 33.9l-33.9 33.9 33.9 33.9c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-33.9-33.9-33.9 33.9c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l33.9-33.9-33.9-33.9c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l33.9 33.9 33.9-33.9c9.4-9.4 24.6-9.4 33.9 0z"
                                            /></svg
                                        >
                                    </button>
                                </form>
                            </div>
                            <div class="w-1/2 flex gap-1 justify-end">
                                <span>
                                    {item.start.toLocaleString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                        timeZone: "UTC",
                                    })}
                                </span>
                                <span> - </span>
                                <span>
                                    {item.end.toLocaleString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                        timeZone: "UTC",
                                    })}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
        <div class="card-actions justify-end">
            <button
                class="btn btn-primary"
                onclick={() => {
                    openGroupModal = false;
                }}
            >
                Close
            </button>
        </div>
    </div>
</Modal>

<div
    class="w-full flex flex-col md:flex-row items-center md:justify-center mt-8 md:mt-16 gap-4"
>
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

            <AddItemForm {users} />
        </div>
    </div>

    <div class="card shadow-sm rounded-2xl">
        <div class="card-body">
            <span class="card-title">Add Users</span>
            <div class="flex gap-2">
                {#each users as user}
                    <span>{user.name}</span>
                {/each}
            </div>
            <form
                method="POST"
                action="?/addUser"
                class="w-full"
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
            <Modal
                title="Delete Users"
                prompt="Delete User"
                haveCloseButton={true}
            >
                <div class="flex flex-col gap-2">
                    {#each users as user}
                        <div class="flex hover:bg-base-200 items-center">
                            <span class="w-full">
                                {user.name}
                            </span>

                            <form
                                action="?/deleteUser"
                                method="POST"
                                use:enhance={() => {
                                    return async ({ update, result }) => {
                                        invalidateAll();
                                        await update();
                                    };
                                }}
                            >
                                <input hidden value={user.id} name="id" />
                                <button class="btn btn-error"> Delete </button>
                            </form>
                        </div>
                    {/each}
                </div>
            </Modal>
        </div>
    </div>
</div>

<div class="w-full px-2 md:hidden flex justify-center mt-4 gap-4">
    {#each days as day, i}
        {#if i == selectedDay}
            <button
                class="btn btn-primary btn-circle"
                onclick={() => {
                    selectedDay = i;
                }}
            >
                {day[0]}
            </button>
        {:else}
            <button
                class="btn btn-circle"
                onclick={() => {
                    selectedDay = i;
                }}
            >
                {day[0]}
            </button>
        {/if}
    {/each}
</div>

<div class="w-full md:py-32 py-8 px-8 md:px-48 flex flex-col">
    <div class="grid grid-cols-[80px_1fr] md:grid-cols-8 gap-x-2 mb-4">
        <span class="w-full">Time Slot</span>
        {#if viewableDay != SELECTED_DAYS.ALL}
            <span class="text-center w-full">
                {days[viewableDay]}
            </span>
        {:else}
            {#each days as day}
                <span class="text-center">{day}</span>
            {/each}
        {/if}
    </div>
    <div
        class="grid grid-cols-[80px_1fr] md:grid-cols-8 md:gap-x-2 [grid-template-rows:repeat(41,1.5em)] bg-calendar-lines relative"
    >
        {#each everyOtherSlot as slot, i}
            <div
                class="col-1 row-span-2 w-full h-full text-gray-500"
                style="
                grid-row-start: {2 * i + 1};
            "
            >
                {slot
                    .toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "UTC",
                    })
                    .slice(0, -4)
                    .trim()}
            </div>
        {/each}

        {#each groups as group, col}
            {#if viewableDay == SELECTED_DAYS.ALL || viewableDay == col}
                {#each group as slot}
                    {@const nUsers = slot.users.length}
                    <div
                        role="button"
                        tabindex="0"
                        class="bg-green-100 hover:bg-green-200 rounded-xl my-2
                        mx-3 md:mx-0"
                        style="
                            grid-column: {isMobile ? 2 : col + 2};
                            grid-row-start: {slot.start + 1}; 
                            grid-row-end: {slot.end + 2};"
                        onkeypress={() => {}}
                        onclick={() => {
                            openGroupModal = true;
                            openItems = slot.items;
                            openUsers = slot.users
                        }}
                    >
                        <div class="p-4 flex flex-col">
                            <span>
                                <span class="font-bold">{nUsers}</span> Users
                            </span>
                            {#each slot.users.slice(0, 5) as user}
                                <div class="overflow-hidden text-ellipsis">
                                    {user.name}
                                </div>
                            {/each}
                            {#if nUsers > 5}
                                <span>...</span>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/if}
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
    }
</style>
