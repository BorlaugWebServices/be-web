<template>
    <b>{{tx_fee | formatGRAM}}</b>
</template>

<script>
    import _ from "lodash";

    export default {
        name: "TxDeposit",
        props: ['hash'],
        data() {
            return {
                tx_fee: 0
            }
        },
        mounted() {
            this.getTransaction();
        },
        methods: {
            async getTransaction() {
                try {
                    let reply = await this.$http.get(`/transactions/${this.hash}`);
                    let depositEvent = _.find(reply.data.events, (event) => {
                        return event.meta.name === "Deposit";
                    });
                    this.tx_fee = depositEvent ? Number(depositEvent.event.data[0]) : 0;
                } catch (e) {

                }
            }
        }
    }
</script>

<style scoped>

</style>
