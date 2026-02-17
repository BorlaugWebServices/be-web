<template>
    <span>{{age}}</span>
</template>

<script>
    import * as fromNow from "from-now";

    export default {
        name: "Age",
        props: ["timestamp"],
        data() {
            return {
                age: '',
                interval: null
            };
        },
        mounted() {
            this.interval = setInterval(() => {
                let age  = fromNow(Number(this.timestamp));
                this.age = age === 'now' ? 'now' : age + ' ago';
            }, 1000);
        },
        unmounted() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }
    }
</script>

<style scoped>

</style>
