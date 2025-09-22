<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    let { item, editable = false } = $props();
</script>

<div class="flex gap-2">
    <span class="grow-0">{item.name}</span>
    <span class="grow-1">{item.start}-{item.end}</span>

    <form
        class="grow-2"
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
        <button>Delete</button>
    </form>
</div>
