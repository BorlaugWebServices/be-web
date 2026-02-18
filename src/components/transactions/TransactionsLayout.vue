<template>
    <PageLayout title="Transactions" icon="fas fa-file-signature">
        <router-view></router-view>
    </PageLayout>
</template>

<script>
    import PageLayout from "@/components/common/PageLayout.vue";

    export default {
        name: "TransactionsLayout",
        components: {
            PageLayout
        }
    }
</script>

<style scoped>

</style>