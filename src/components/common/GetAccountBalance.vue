<template>
    <b>{{ $filters.formatGRAM(balance) }}</b>
</template>

<script>
    export default {
        name: "GetAccountBalance",
        props: ['address'],
        data() {
            return {
                balance: 0
            }
        },
        mounted() {
            this.getBalance();
        },
        methods: {
            async getBalance() {
                try {
                    let {data} = await this.axios.get(`/accounts/${this.address}/balance`);
                    this.balance = data;
                } catch (e) {

                }
            }
        }
    }
</script>

<style scoped>

</style>
