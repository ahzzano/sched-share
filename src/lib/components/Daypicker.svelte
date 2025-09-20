<script lang="ts">
    let selectedDays = [false,false,false,false,false,false,false]

</script>

<div class="join-horizontal join">

    {#each ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"] as day, i}
        <input type="hidden" name={day} value={selectedDays[i] == true ? 'on' : null}/>
        <button 
            class="join-item btn" 
            type="button"
        >
            {day}
        </button>
    {/each}
</div>
