<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Modal from "./Modal.svelte";

    let { item, editCallback = undefined } = $props();
</script>

<div
    class="flex items-center"
    ondblclick={() => {
        Proxy;
        if (editCallback) {
            editCallback(item);
        }
    }}
    role="listitem"
>
    <span class="w-1/2">{item.name}</span>
    <div class="w-full flex gap-1 items-center justify-center">
        <span class="w-1/3">{item.start}</span>
        <span class="w-1/3">{item.end}</span>
    </div>
</div>
