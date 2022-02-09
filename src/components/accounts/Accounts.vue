<template>
    <div class="row">
        <div class="col-12">
            <div class="card ">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="card-header-title">
                        <h5 v-if="show">Showing {{accounts.length}} of {{total}} accounts</h5>
                    </div>
                    <div class="card-header-icon">
                        <h3><i class="fas fa-users card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body m-t-0 p-0">
                    <div class="table-responsive blocks">
                        <table class="table v-middle">
                            <thead>
                            <tr class="border-0">
                                <th class="border-0">#</th>
                                <th class="border-0 font-weight-bold">Address</th>
                                <th class="border-0 font-weight-bold">No. of Transactions</th>
                                <th class="border-0 text-right font-weight-bold">Balance</th>
                                <th class="border-0"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(account, index) in accounts">
                                <td>{{index+1}}</td>
                                <td>
                                    <dd class="mb-1">
                                        <div class="float-left mr-2" :class="isMobile?'pt-2':''">
                                            <Blockie :address="account.signer" class="mm-5-0-5-0"/>
                                        </div>
                                        <div class="float-left adjust-40">
                                            <span :title="account.signer" class="align-middle word-break">{{ account.signer }}</span>
                                        </div>
                                    </dd>
                                </td>
                                <td>{{account.count}}</td>
                                <td class="text-right">
                                    <b>{{account.balance | formatGRAM}}</b>
                                </td>
                                <td class="text-right">
                                    <router-link
                                            :to="{name: 'view-account', params: {address: account.signer}}"
                                            class="btn btn-sm btn-orange text-white">
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
                            :container-class="'ui pagination menu float-right'"
                            :margin-pages="2"
                            :page-count=pageCount
                            :page-range="1"
                            :prev-text="'Prev'"
                            :no-li-surround="true"
                            :page-link-class="'page-link'"
                            :prev-link-class="'page-link'"
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
    import Paginate from 'vuejs-paginate';
    import Age from "../common/Age";
    import {isMobile} from "mobile-device-detect";
    import Blockie from "../common/Blockie";
    import GetAccountBalance from "../common/GetAccountBalance";

    export default {
        name: "Accounts",
        props: ['address'],
        components: {GetAccountBalance, Paginate, Age, Blockie},
        data() {
            return {
                isMobile: isMobile,
                accounts: [],
                total: 0,
                pageCount: 1,
                show: false,
                perPage: localStorage.getItem("perPage") || 10
            };
        },
        mounted() {
            this.getSigners(1);
        },
        methods: {
            async getSigners(page) {
                try {
                    EventBus.$emit('show');
                    let reply = await this.$http.get(`/accounts`, {
                        params: {
                            page: page - 1,
                            perPage: this.perPage
                        }
                    });
                    this.accounts = reply.data.slice;
                    this.total = reply.data.total;
                    this.accounts = this.accounts.map(a=> {
                        a.signer = JSON.parse(a.signer).Id;
                        return a;
                    })
                    this.setPageCount();
                } catch (e) {

                } finally {
                    this.show = true;
                    EventBus.$emit('hide');
                }
            },
            pageHandler(pageNum) {
                this.getSigners(pageNum);
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
