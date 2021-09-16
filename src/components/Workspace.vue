<template>
    <div id="main-wrapper">
        <workspace-topbar></workspace-topbar>
        <workspace-menubar></workspace-menubar>

        <div class="container" style="min-height:700px;">
            <router-view></router-view>
        </div>
        <workspace-footer></workspace-footer>
    </div>
</template>

<script>
    import WorkspaceTopbar from './WorkspaceTopbar.vue';
    import WorkspaceMenubar from './WorkspaceMenubar.vue';
    import WorkspaceFooter from './WorkspaceFooter.vue';

    export default {
        name: 'app',
        components: {WorkspaceTopbar, WorkspaceMenubar, WorkspaceFooter},
        data() {
            return {}
        },
        mounted() {
        },
        methods: {

        }
    }
</script>

<style lang="scss">
</style>
