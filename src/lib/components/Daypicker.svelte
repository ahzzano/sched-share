<script lang="ts">
    let { selectedDays = [false, false, false, false, false, false, false] } =
        $props();
</script>

<div class="w-full md:join flex flex-wrap">
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
            onclick={() => (selectedDays[i] = !selectedDays[i])}
            type="button"
        >
            {day}
        </button>
    {/each}
</div>
