<template>
    <PageLayout title="Accounts" icon="fas fa-users">
        <router-view></router-view>
    </PageLayout>
</template>

<script>
    import PageLayout from "@/components/common/PageLayout.vue";

    export default {
        name: "AccountLayout",
        components: {
            PageLayout
        }
    }
</script>

<style scoped>

</style>