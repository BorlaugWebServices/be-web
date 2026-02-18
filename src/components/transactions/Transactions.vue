<template>
    <PaginatedTable
        icon="fas fa-file-signature"
        entityName="transactions"
        :headers="['Hash', 'Block', 'Age', 'Module', 'Method', 'Weight', 'Transaction Cost']"
        :items="transactions"
        :total="total"
        :pageCount="pageCount"
        :show="show"
        @page-change="pageHandler"
    >
        <template #body="{ items }">
            <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(transaction, index) in items">
                <td>
                    <i class="fas fa-file-signature"></i>
                </td>
                <td class="block">
                    <div class="d-flex no-block align-items-center" :title="transaction.hash">
                        <router-link :to="{name: 'transaction-from-chain', params: {blockhashornumber: transaction.blockNumber, txhash: transaction.hash}}">{{ formatters.truncate(transaction.hash, 16, '...')}}</router-link>
                    </div>
                </td>
                <td>
                    <div class="d-flex no-block align-items-center">
                        <router-link :to="{name: 'block', params: {number: transaction.blockNumber}}">{{ transaction.blockNumber}}</router-link>
                    </div>
                </td>
                <td>
                    <age v-if="transaction.timestamp" :timestamp="transaction.timestamp"/>
                </td>
                <td>
                    {{transaction.method.section}}
                </td>
                <td>
                    {{transaction.method.method}}
                </td>
                <td>
                    {{transaction.weight?.toLocaleString()}}
                </td>
                <td class="text-right"><b>{{ formatters.formatGRAM(transaction.tx_fee) }}</b></td>
                <td class="text-right">
                    <router-link :to="{name: 'transaction-from-chain', params: {blockhashornumber: transaction.blockNumber, txhash: transaction.hash}}" class="btn btn-sm btn-orange text-white">
                        Details
                    </router-link>
                </td>
            </tr>
        </template>
    </PaginatedTable>
</template>

<script>
    import EventBus from "../../event-bus";
    import Age from "../common/Age.vue";
    import PaginatedTable from "../common/PaginatedTable.vue";
    import { formatters } from "@/utils/formatters";

    export default {
        name: "Transactions",
        components: { Age, PaginatedTable},
        data() {
            return {
                transactions: [],
                total: 0,
                pageCount: 1,
                show: false,
                perPage: localStorage.getItem("perPage") || 10,
                formatters: formatters
            };
        },
        mounted() {
            this.getRecentTxns(1);
        },
        methods: {
            async getRecentTxns(page) {
                try {
                    EventBus.emit('show');
                    let reply         = await this.axios.get("/transactions", {
                        params: {
                            page: page - 1,
                            perPage: this.perPage
                        }
                    });
                    this.transactions = reply.data.slice;
                    this.total        = reply.data.total;
                    this.setPageCount();
                    this.show = true;
                } catch(e) {

                } finally {
                    EventBus.emit('hide');
                }
            },
            pageHandler(pageNum) {
                this.getRecentTxns(pageNum);
            },
            setPageCount() {
                this.pageCount = this.total <= 10 ? 1 : Math.ceil(this.total / 10);
            }
        }
    }
</script>

<style scoped>
    .block {
        width: 200px;
        min-width: 200px;
    }
</style>
