<template>
    <div class="row">
        <div class="col-12">
            <ExplorerCard title="Account" title-tag="h4" icon-class="fas fa-user" cardClass="mb-4" body-class="mg-b-20 p-t-0">
                <DetailItem title="Address" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
                    <div class="mb-1">
                        <Blockie :address="address" class="mm-5-0-5-0"/>
                        <span :title="address" class="m-l-5 align-middle">{{ address }}</span>
                    </div>
                </DetailItem>
                <DetailItem title="Available Balance" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
                    <div class="mb-1">
                        <get-account-balance :address="address" class="text-orange"></get-account-balance>
                    </div>
                </DetailItem>
                <DetailItem title="Spent on Transactions" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left" :noSeparator="true">
                    <div class="mb-1">
                        <b class="text-orange">{{ formatters.formatGRAM(spent_on_txs) }}</b>
                    </div>
                </DetailItem>
            </ExplorerCard>

            <ExplorerCard v-if="transactions.length>0" icon-class="fa fa-file-signature" body-class="m-t-0 p-0">
                <template #title>
                    <h5 v-if="show">Showing {{transactions.length}} of {{total}} transactions</h5>
                </template>

                <div class="table-responsive blocks">
                    <table class="table v-middle">
                        <thead>
                        <tr class="border-0">
                            <th class="border-0"></th>
                            <th class="border-0 font-weight-bold">Hash</th>
                            <th class="border-0 font-weight-bold">Block</th>
                            <th class="border-0 font-weight-bold">Age</th>
                            <th class="border-0 font-weight-bold">Module</th>
                            <th class="border-0 font-weight-bold">Method</th>
                            <th class="border-0 text-right font-weight-bold">Transaction Cost</th>
                            <th class="border-0"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(transaction, index) in transactions">
                            <td>
                                <i class="fas fa-file-signature"></i>
                            </td>
                            <td class="block">
                                <div :title="transaction.hash" class="d-flex no-block align-items-center">
                                    <router-link
                                            :to="{name: 'transaction-from-chain', params: {blockhashornumber: transaction.blockNumber, txhash: transaction.hash}}">
                                        {{ formatters.truncate(transaction.hash, 16, '...') }}
                                    </router-link>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex no-block align-items-center">
                                    <router-link :to="{name: 'block', params: {number: transaction.blockNumber}}">{{
                                        transaction.blockNumber}}
                                    </router-link>
                                </div>
                            </td>
                            <td>
                                <age :timestamp="transaction.timestamp" v-if="transaction.timestamp"/>
                            </td>
                            <td>
                                {{transaction.method.section}}
                            </td>
                            <td>
                                {{transaction.method.method}}
                            </td>
                            <td class="text-right">
                                <b>{{ formatters.formatGRAM(transaction.tx_fee) }}</b>
                            </td>
                            <td class="text-right">
                                <router-link
                                        :to="{name: 'transaction-from-chain', params: {blockhashornumber: transaction.blockNumber, txhash: transaction.hash}}"
                                        class="btn btn-sm btn-orange text-white">
                                    Details
                                </router-link>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </ExplorerCard>

            <ExplorerCard title="Transactions" v-else>
                <h4 class="text-muted text-center">No records found</h4>
            </ExplorerCard>
        </div>
        <div class="col-lg-12" v-if="transactions.length>0">
            <div class="text-right">
                <nav aria-label="Page navigation example">
                    <paginate
                            :click-handler="pageHandler"
                            :container-class="'pagination justify-content-end'"
                            :margin-pages="2"
                            :page-count="pageCount"
                            :page-range="1"
                            :prev-text="'Prev'"
                            :next-text="'Next'"
                            :no-li-surround="false"
                            :page-class="'page-item'"
                            :page-link-class="'page-link'"
                            :prev-class="'page-item'"
                            :prev-link-class="'page-link'"
                            :next-class="'page-item'"
                            :next-link-class="'page-link'"
                            :break-view-link-class="'break-view-link'">
                    </paginate>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import Paginate from 'vuejs-paginate-next';
    import Age from "../common/Age.vue";
    import Blockie from "../common/Blockie.vue";
    import GetAccountBalance from "../common/GetAccountBalance.vue";
    import ExplorerCard from '@/components/common/ExplorerCard.vue';
    import DetailItem from "../common/DetailItem.vue";
    import { formatters } from "@/utils/formatters";

    export default {
        name: "Account",
        props: ['address'],
        components: {GetAccountBalance, Blockie, Paginate, Age, ExplorerCard, DetailItem},
        data() {
            return {
                transactions: [],
                total: 0,
                pageCount: 1,
                show: false,
                perPage: localStorage.getItem("perPage") || 10,
                spent_on_txs: 0,
                formatters: formatters
            };
        },
        mounted() {
            this.init(1);
        },
        methods: {
            async init() {
                await this.getTxsByAccount(1);
                await this.getTotalSpent();
            },
            async getTxsByAccount(page) {
                try {
                    EventBus.emit('show');
                    let reply = await this.axios.get(`/accounts/${this.address}`, {
                        params: {
                            page: page - 1,
                            perPage: this.perPage
                        }
                    });
                    this.transactions = reply.data.slice;
                    this.total = reply.data.total;
                    this.setPageCount();
                    this.show = true;
                } catch (e) {

                } finally {
                    EventBus.emit('hide');
                }
            },
            async getTotalSpent() {
                try {
                    let reply = await this.axios.get(`/accounts/${this.address}`, {
                        params: {
                            page: 0,
                            perPage: this.total
                        }
                    });
                    this.spent_on_txs = reply.data.slice.reduce((total, item) => total + item.tx_fee, 0);
                } catch (e) {

                }
            },
            pageHandler(pageNum) {
                this.getTxsByAccount(pageNum);
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

    .blocks table td {
        padding: 1em 1em !important;
        vertical-align: top !important;
    }

    .blocks table th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6 !important;
    }

</style>
