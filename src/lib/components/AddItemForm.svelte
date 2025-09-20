<script lang="ts">
    import Daypicker from "$lib/components/Daypicker.svelte";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    let { user } = $props();
</script>

<div class="w-full">
    <form
        method="POST"
        action="?/addItemToSchedule"
        use:enhance={() => {
            return async ({ update }) => {
                invalidateAll();
                await update();
            };
        }}
        class="flex flex-col gap-2"
    >
        <input type="hidden" name="userId" value={user.id} />

        <div class="input w-full">
            <span class="label">Item Name</span>
            <input type="text" name="itemName" placeholder="Add Item" />
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
