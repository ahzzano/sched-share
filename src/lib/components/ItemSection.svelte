<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    let { items, title } = $props();
</script>

{#if items.length > 0}
    <div class="collapse bg-base-100 border border-base-300 collapse-arrow join-item">
        <input type="checkbox" name="my-accordion-1" checked={false} />
        <div class="collapse-title">{title}</div>
        <div class="collapse-content">
            {#each items as item}
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
            {/each}
        </div>
    </div>
{/if}
