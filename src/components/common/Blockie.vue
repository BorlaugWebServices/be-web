<template>
    <img alt="image" class="rounded-circle" :width="width" :src="getBlockie(address)"/>
</template>

<script>
    import makeBlockie from 'ethereum-blockies-base64';

    export default {
        name: "Blockie",
        props: {
            width: {
                type: Number,
                default: 32
            },
            address: {
                type: String
            }
        },
        methods: {
            getBlockie(seed) {
                return makeBlockie(seed);
            }
        }
    }
</script>

<style scoped>

</style>