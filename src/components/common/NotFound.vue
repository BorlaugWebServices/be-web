<template>
    <div class="container">
        <div class="card card-body text-center" v-if="isPage">
            <div class="col-md-12 text-center text-muted">
                    <span class="display-1 d-block">
                        <i class="fa fa-exclamation-triangle"/>
                    </span>
                <div class="mb-4 lead">Page not found.</div>
                <router-link :to="{ name: 'home' }" class="font-weight-bold text-orange"> Back to Home</router-link>
            </div>
        </div>
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
    export default {
        name: "404",
        props: ["module", "moduleId", "isPage"]
    }
</script>

<style scoped>

</style>