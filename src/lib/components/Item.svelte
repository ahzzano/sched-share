<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    let { item, editable = false } = $props();
</script>

<div class="flex items-center">
    <span class="w-1/2">{item.name}</span>
    <span class="w-1/3">{item.start}-{item.end}</span>
    <form
        class="w-fit"
        action="?/deleteSchedule"
        method="POST"
        use:enhance={() => {
            return async ({ update }) => {
                invalidateAll();
                await update();
            };
        }}
    >
        <input type="hidden" name="id" value={item.id} />
        <button class="btn btn-ghost btn-sm btn-error">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-4 w-4"
                ><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                    d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm72 200l176 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-176 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                /></svg
            >
        </button>
    </form>
</div>
