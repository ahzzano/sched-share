<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import Daypicker from "$lib/components/Daypicker.svelte";
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

<div class="flex gap-5 p-5">
    {#each users as user}
        <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
                <div class="card-title">
                    <span class="grow-1">{user.name}</span>
                    <form action="?/deleteUser" method="POST" use:enhance={() => {
                        return async ({ update }) => {
                            invalidateAll()
                            await update()
                        }
                    }}>
                        <input type="hidden" name="id" value={user.id}/>
                        <button>Delete</button>
                    </form>
                </div>
                {#each user.items as item}
                    <div class="flex gap-2">
                        <span class="grow-0">{item.name}</span>
                        <span class="grow-1">{item.start}-{item.end}</span>

                        <form 
                            class="grow-2"
                            action="?/deleteSchedule" 
                            method="POST" 
                            use:enhance={() => {
                                return async ({ update }) => {
                                    invalidateAll()
                                    await update()
                                }
                            }}>
                            <input type="hidden" name="id" value={item.id}/>
                            <button>Delete</button>
                        </form>
                    </div>
                {/each}
                <form
                    method="POST"
                    action="?/addItemToSchedule"
                    use:enhance={() => {
                        return async ({ update }) => {
                            invalidateAll()
                            await update()
                        }
                    }}
                    class="flex flex-col gap-2"
                >
                    <input type="hidden" name="userId" value={user.id}/>

                    <input type="text" name="itemName" class="input" placeholder="Add Item"/>
                    <div class="flex gap-2">
                        <div class="input">
                            <span class="label">Start</span>
                            <input type="time" name="startTime" required />
                        </div>
                        <div class="input">
                            <span class="label">End</span>
                            <input type="time" name="endTime" required />
                        </div>
                    
                    </div>

                    <Daypicker/>

                    <button>
                        Add Item
                    </button>
                </form>
            </div>

        </div>
    {/each}
</div>

