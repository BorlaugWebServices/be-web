<template>
    <header>
        <div class="navbar shadow-sm">
            <div class="container d-flex justify-content-between">
                <router-link :to="{name: 'home'}" class="navbar-brand d-flex align-items-center">
                    <img src="../assets/images/logo-orange-full-sm.png" alt="" height="30">
                </router-link>
            </div>
        </div>
    </header>

</template>

<script>
    export default {
        name: "WorkspaceTopbar",
        methods: {}
    }
</script>

<style scoped>

</style>