<template>
    <div id="app">
        <router-view></router-view>

        <Loading
                :active.sync="show"
                :background-color="backgroundColor"
                :can-cancel="false"
                :color="color"
                :is-full-page="true"
                :loader="loader"
                :opacity="opacity"/>
    </div>
</template>

<script>
    import EventBus from "./event-bus";
    import Loading from 'vue-loading-overlay';

    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
        name: 'App',
        components: {Loading},
        data() {
            return {
                show: false,
                color: '#FB8C00',
                backgroundColor: '#dddddd',
                opacity: 0.5,
                loader: 'bars'
            }
        },
        mounted() {
            EventBus.$on('hide', () => {
                this.show = false;
            });
            EventBus.$on('show', () => {
                this.show = true;
            });
        }
    }
</script>

<style>
</style>
