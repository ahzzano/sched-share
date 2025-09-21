<script lang="ts">
    import Daypicker from "$lib/components/Daypicker.svelte";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Modal from "./Modal.svelte";
    let { user } = $props();

    let open = $state(false);
</script>

<Modal prompt="AddItem" title="New Item" bind:open={open}>
    <div class="w-full">
        <form
            method="POST"
            action="?/addItemToSchedule"
            use:enhance={() => {
                open = false
                return async ({ update }) => {
                    invalidateAll();
                    await update();
                };
            }}
            class="flex flex-col gap-2"
        >
            <input type="hidden" name="userId" value={user.id} />

            <div class="input w-full">
                <span class="label">Name</span>
                <input type="text" name="itemName" placeholder="Studying..." />
            </div>

            <div class="flex gap-2">
                <div class="input">
                    <span class="label">Start</span>
                    <input type="time" name="startTime" required />
                </div>
                <div class="input">
                    <span class="label">End</span>
                    <input type="time" name="endTime" required />
                </div>
            </div>

            <Daypicker />

            <button class="btn w-full"> Add </button>
        </form>
    </div>
</Modal>
