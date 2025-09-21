<script lang="ts">
    import { goto } from "$app/navigation";

    let groupId = $state(null);
</script>

<div class="flex flex-col gap-4 w-full justify-center items-center h-screen">
    <div class="hero">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl">Welcome to <b>SchedShare!</b></h1>
                <p class="py-8">
                    A schedule sharing app for students to share your times
                    together
                </p>
                <b class="text-2xl">Get started by...</b>
            </div>
        </div>
    </div>
    <div class="flex">
        <div class="card bg-base-100 shadow-sm md:w-128">
            <div class="card-body">
                <h2 class="card-title">Joining a Group</h2>
                <div class="input w-full">
                    <span class="label">Group ID</span>
                    <input name="groupId" bind:value={groupId} type="number" />
                </div>
                <div class="card-actions justify-center">
                    <button
                        class="btn btn-primary"
                        onclick={() => {
                            goto(`/${groupId}`);
                        }}
                    >
                        Join Group</button
                    >
                </div>
            </div>
        </div>
        <div class="divider divider-horizontal">OR</div>
        <div class="card bg-base-100 shadow-sm md:w-128">
            <div class="card-body">
                <h2 class="card-title">Creating a Group</h2>
                <form
                    method="POST"
                    action="?/createSession"
                    class="flex flex-col gap-2"
                >
                    <div class="input w-full">
                        <span class="label">Group Name</span>
                        <input name="groupName" />
                    </div>
                    <div class="card-actions justify-center">
                        <button class="btn btn-primary"> Create Group </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
