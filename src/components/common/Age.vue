<template>
    <span>{{age}}</span>
</template>

<script>
    import * as fromNow from "from-now";

    export default {
        name: "Age",
        props: {timestamp: Number},
        data() {
            return {
                age: ''
            };
        },
        mounted() {
            setInterval(() => {
                let age  = fromNow(this.timestamp);
                this.age = age === 'now' ? 'now' : age + ' ago';
            }, 1000);
        }
    }
</script>

<style scoped>

</style>