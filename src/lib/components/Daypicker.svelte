<script lang="ts">
    // let selectedDays = [false, false, false, false, false, false, false];
    let { selectedDays = $bindable([false, false, false, false, false, false, false]) } =
        $props();
    let textToDisplay = ["S", "M", "T", "W", "T", "F", "S"];
</script>

<div class="w-full join flex flex-wrap">
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
            {textToDisplay[i]}
        </button>
    {/each}
</div>
