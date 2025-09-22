<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Item from "./Item.svelte";

    let { items, title } = $props();
</script>

{#if items.length > 0}
    <div
        class="collapse bg-base-100 border border-base-300 collapse-arrow join-item"
    >
        <input type="checkbox" name="my-accordion-1" checked={false} />
        <div class="collapse-title">{title}</div>
        <div class="collapse-content">
            {#each items as item}
                <Item {item} />
            {/each}
        </div>
    </div>
{/if}
