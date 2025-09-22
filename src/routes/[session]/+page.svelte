<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const group = $derived(data.group);
</script>

<div class="w-full flex items-center justify-center mt-8 md:mt-16">
    <div class="card shadow-sm rounded-2xl">
        <div class="card-body">
            <div class="flex flex-col text-left">
                {#if group.name}
                    <span class="text-2xl card-title">{group.name}</span>
                {:else}
                    <span class="text-2xl card-title">No Group Name</span>
                {/if}

                <span> Add someone's schedule here </span>
            </div>

            <form
                method="POST"
                action="?/addUser"
                class="w-full md:w-128"
                use:enhance={() => {
                    return async ({ update, result }) => {
                        invalidateAll();
                        await update();
                    };
                }}
            >
                <div class="join w-full">
                    <input
                        name="username"
                        placeholder="Username: Don Pedro"
                        class="input w-full"
                    />
                    <button class="btn">Add User</button>
                </div>
            </form>
        </div>
    </div>
</div>
