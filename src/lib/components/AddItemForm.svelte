<script lang="ts">
    import Daypicker from "$lib/components/Daypicker.svelte";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Modal from "./Modal.svelte";
    let { users } = $props();
    let days = $state([false, false, false, false, false, false, false]);

    let open = $state(false);
</script>

<form
    method="POST"
    action="?/addItemToSchedule"
    use:enhance={() => {
        open = false;
        return async ({ update }) => {
            invalidateAll();
            await update();
            days =  [false, false, false, false, false, false, false]
        };
    }}
    class="flex flex-col gap-2"
>
    <select name="userId" class="input">
        {#each users as user}
        <option value={user.id}>{user.name}</option>
        {/each}
    </select>

    <div class="input w-full">
        <span class="label">Name</span>
        <input type="text" name="itemName" placeholder="Studying..." />
    </div>

    <div class="flex flex-col md:flex-row w-full gap-2">
        <div class="input w-full">
            <span class="label">Start</span>
            <input
                class="appearance-none"
                type="time"
                name="startTime"
                required
            />
        </div>
        <div class="input w-full">
            <span class="label">End</span>
            <input type="time" name="endTime" required />
        </div>
    </div>

    <Daypicker bind:selectedDays={days}/>

    <button class="btn w-full"> Add </button>
</form>
