<template>
    <PageLayout title="Inherents" icon="fas fa-file-alt">
        <router-view></router-view>
    </PageLayout>
</template>

<script>
    import PageLayout from "@/components/common/PageLayout.vue";

    export default {
        name: "InherentsLayout",
        components: {
            PageLayout
        }
    }
</script>

<style scoped>

</style>