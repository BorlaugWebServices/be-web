<template>
    <PageLayout title="Blocks" icon="fas fa-cube">
        <router-view></router-view>
    </PageLayout>
</template>

<script>
    import PageLayout from "@/components/common/PageLayout.vue";

    export default {
        name: "BlocksLayout",
        components: {
            PageLayout
        }
    }
</script>

<style scoped>

</style>