<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Item from "./Item.svelte";
    import Modal from "./Modal.svelte";

    let { items, title, editCallback = undefined } = $props();
</script>

{#if items.length > 0}
    <div
        class="collapse bg-base-100 border border-base-300 collapse-arrow join-item"
    >
        <input type="checkbox" name="my-accordion-1" checked={false} />
        <div class="collapse-title">{title}</div>
        <div class="collapse-content pr-0">
            {#each items as item}
                <Item {item} {editCallback}/>
            {/each}
        </div>
    </div>
{/if}
