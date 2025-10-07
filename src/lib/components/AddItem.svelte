<script lang="ts">
    let isMobile = $state(false);

    $effect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const update = () => (isMobile = mediaQuery.matches);
        update(); // initial

        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    });
</script>

<div>
Hello World!
</div>
