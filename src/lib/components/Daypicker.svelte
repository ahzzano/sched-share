<script lang="ts">
    let selectedDays = [false, false, false, false, false, false, false];
</script>

<div class="w-full join flex">
    {#each ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"] as day, i}
        <input
            type="hidden"
            name={day}
            value={selectedDays[i] == true ? "on" : null}
        />
        <button
            class="join-item btn btn-sm flex-1 {selectedDays[i]
                ? 'btn-primary btn-active'
                : ''}"
            on:click={() => (selectedDays[i] = !selectedDays[i])}
            type="button"
        >
            {day}
        </button>
    {/each}
</div>
