<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    // let users = $state(data.users);
    const users = $derived(data.users)
</script>

{data.session}

Add Schedule
<div>
    <form
        method="POST"
        action="?/addUser"
        use:enhance={() => {
            return async ({ update, result }) => {
                invalidateAll()
                await update();
            };
        }}
    >
        <input name="username" placeholder="username" />
        <input name="password" type="password" />
        <button>Add User</button>
    </form>
</div>

<div class="grid-cols-5 grid gap-3">
    {#each users as user}
        <div>
            <span>{user.name}</span>
            <form
                method="POST"
                action="?/addItemToSchedule"
                use:enhance={() => {
                    return async ({ update }) => {
                        invalidateAll()
                        await update()
                    }
                }}
                class="flex flex-col"
            >
                <input type="hidden" value=""/>

                <input type="text" name="itemName"/>
                <div>
                    <input type="time" name="startTime"/>
                    <input type="time" name="endTime"/>
                </div>

                <span>
                    Days
                </span>

                <input type="checkbox" name="sunday"/>
                <label for="sunday"> Sunday </label>
                <input type="checkbox" name="monday"/>
                <label for="monday"> Monday </label>
                <input type="checkbox" name="tuesday"/>
                <label for="tuesday"> Tuesday </label>
                <input type="checkbox" name="wednesday"/>
                <label for="wednesday"> Wednesday </label>
                <input type="checkbox" name="thursday"/>
                <label for="thursday"> Thursday </label>
                <input type="checkbox" name="friday"/>
                <label for="friday"> Friday </label>
                <input type="checkbox" name="saturday"/>
                <label for="saturday"> Saturday </label>

                <button>
                    Add Item
                </button>
            </form>
        </div>
    {/each}
</div>

