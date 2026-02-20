<template>
    <div class="container">
        <ExplorerCard v-if="isPage" cardClass="text-center">
            <div class="col-md-12 text-center text-muted">
                    <span class="display-1 d-block">
                        <i class="fa fa-exclamation-triangle"/>
                    </span>
                <div class="mb-4 lead">Page not found.</div>
                <router-link :to="{ name: 'home' }" class="font-weight-bold text-orange"> Back to Home</router-link>
            </div>
        </ExplorerCard>
        <div class="row justify-content-center" v-else>
            <div class="col-md-12 text-center text-muted">
                    <span class="display-1 d-block">
                        <i class="fa fa-exclamation-triangle"/>
                    </span>
                <div class="mb-4 lead">{{module}} {{moduleId}} not found.</div>
                <router-link :to="{ name: 'home' }" class="font-weight-bold text-orange"> Back to Home</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import ExplorerCard from "@/components/common/ExplorerCard.vue";

    export default {
        name: "404",
        props: ["module", "moduleId", "isPage"],
        components: {ExplorerCard}
    }
</script>

<style scoped>

</style>
