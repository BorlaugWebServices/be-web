<template>
    <b>{{ formatters.formatGRAM(balance) }}</b>
</template>

<script>
    import { formatters } from "@/utils/formatters";

    export default {
        name: "GetAccountBalance",
        props: ['address'],
        data() {
            return {
                balance: 0,
                formatters: formatters
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
