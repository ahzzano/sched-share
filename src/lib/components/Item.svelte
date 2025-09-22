<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Modal from "./Modal.svelte";

    let { item, editCallback = undefined } = $props();
</script>

<button
    class="flex items-center w-full justify-start"
    onclick={() => {
        Proxy;
        if (editCallback) {
            editCallback(item);
        }
    }}
>
    <span class="w-1/2">{item.name}</span>
    <div class="w-full flex gap-1 items-center justify-center">
        <span class="w-1/3">{item.start}</span>
        <span class="w-1/3">{item.end}</span>
    </div>
</button>
