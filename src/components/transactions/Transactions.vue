<template>
    <div class="row">
        <div class="col-12">
            <div class="card ">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="card-header-title">
                        <h5 v-if="show">Showing {{transactions.length}} of {{total}} transactions</h5>
                    </div>
                    <div class="card-header-icon">
                        <h3><i class="fas fa-file-signature card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body m-t-0 p-0">
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
                                <th class="border-0"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(transaction, index) in transactions">
                                <td>
                                    <i class="fas fa-file-signature"></i>
                                </td>
                                <td class="block">
                                    <div class="d-flex no-block align-items-center" :title="transaction.hash">
                                        <router-link :to="{name: 'transaction', params: {hash: transaction.hash}}">{{ transaction.hash | truncate(16, '...')}}</router-link>
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
                                <!--                                <td>-->
                                <!--                                    {{block.events.length}}-->
                                <!--                                </td>-->
                                <!--                                <td>-->
                                <!--                                    {{block.logs.length}}-->
                                <!--                                </td>-->
                                <td class="text-right">
                                    <router-link :to="{name: 'transaction', params: {hash: transaction.hash}}" class="btn btn-sm btn-orange text-white">
                                        Details
                                    </router-link>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-12">
            <div class="text-right">
                <nav aria-label="Page navigation example">
                    <paginate
                            :click-handler="pageHandler"
                            :container-class="'pagination float-right'"
                            :margin-pages="2"
                            :next-class="'page-link'"
                            :next-text="'Next'"
                            :page-class="'page-link'"
                            :page-count=pageCount
                            :page-range="1"
                            :prev-class="'page-link'"
                            :prev-text="'Prev'">
                    </paginate>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import Paginate from 'vuejs-paginate';
    import Age from "../common/Age";

    export default {
        name: "Transactions",
        components: {Paginate, Age},
        data() {
            return {
                transactions: [],
                total: 0,
                pageCount: 1,
                show: false,
                perPage: localStorage.getItem("perPage") || 10
            };
        },
        mounted() {
            this.getRecentTxns(1);
        },
        methods: {
            async getRecentTxns(page) {
                try {
                    EventBus.$emit('show');
                    let reply         = await this.$http.get("/transactions", {
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
                    EventBus.$emit('hide');
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

    .blocks table td {
        padding: 1em 1em !important;
        vertical-align: top !important;
    }

    .blocks table th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6 !important;
    }
</style>