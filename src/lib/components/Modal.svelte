<script lang="ts">
    let { children, prompt, title, open = $bindable(true)} = $props();

    let isOpen = $derived(open)
    function toggle() {
        open = !open;
    }
</script>

<button class="btn" onclick={toggle}>
    {prompt}
</button>

{#if isOpen}
    <div class="modal modal-open">
        <div class="modal-box">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={toggle}>✕</button
            >
            <h3 class="text-lg font-bold">{title}</h3>
            <div class="py-2">
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
