<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <div class="card text-white bg-light">
                    <div class="card-body">
                        <h4 class="card-title text-dark m-b-20">Explore Blocks, Transactions and Addresses</h4>
                        <div class="input-group">
                            <input aria-describedby="button-header-search" autocomplete="off" autofocus="" class="form-control form-control--focus-white searchautocomplete ui-autocomplete-input"
                                   id="searchCriteria" name="searchCriteria" placeholder="Search by Block Number / Txhash / Lease Id" type="text" v-model="searchCriteria">
                            <div class="input-group-append" v-if="searchResult">
                                <button @click="clear" class="btn btn-orange text-white font-weight-bold" type="submit">
                                    <i class="fa fa-search d-inline-block d-sm-none"></i><span class="d-none d-sm-inline-block">Clear</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="!searchCriteria">
            <div class="col-md-12">
                <div class="card ">
                    <div class="card-header row m-b-0 p-b-0">
                        <div class="col-md-6 card-title">
                            <h3>Latest Blocks</h3>
                        </div>
                        <div class="col-md-6 text-right">
                            <h3>
                                <a href="javascript:void(0);">
                                    <i class="fa fa-cubes card-title text-orange"/>
                                </a>
                            </h3>
                        </div>
                    </div>

                    <div class="card-body m-t-0 p-0">
                        <div class="table-responsive blocks">
                            <table class="table v-middle">
                                <thead>
                                <tr class="border-0">
                                    <th class="border-0"></th>
                                    <th class="border-0 font-weight-bold">Number</th>
                                    <th class="border-0 font-weight-bold">Age</th>
                                    <th class="border-0 font-weight-bold">Transactions</th>
                                    <th class="border-0 font-weight-bold">Inherents</th>
                                    <th class="border-0 font-weight-bold">Events</th>
                                    <th class="border-0 font-weight-bold">Logs</th>
                                    <th class="border-0"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(block, index) in blocks">
                                    <td>
                                        <i class="fa fa-cube"></i>
                                    </td>
                                    <td class="block">
                                        <div class="d-flex no-block align-items-center">
                                            <router-link :to="{name: 'block', params: {number: block.number}}">{{ block.number}}</router-link>
                                        </div>
                                    </td>
                                    <td>
                                        <age :timestamp="block.timestamp"/>
                                    </td>
                                    <td>
                                        {{block.transactions.length}}
                                    </td>
                                    <td>
                                        {{block.inherents.length}}
                                    </td>
                                    <td>
                                        {{block.events.length}}
                                    </td>
                                    <td>
                                        {{block.logs.length}}
                                    </td>
                                    <td class="text-right">
                                        <router-link :to="{name: 'block', params: {number: block.number}}" class="btn btn-sm btn-orange text-white">
                                            Details
                                        </router-link>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="m-b-10">Last Synced Block Time: <strong>{{latestBlockTime.toString() | timestamp}}</strong></div>
                        <router-link :to="{name: 'blocks'}" class="btn btn-orange btn-block text-white font-weight-bold">View All Blocks</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-else>
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header row m-b-0 p-b-0">
                        <div class="col-md-6 card-title">
                            <h3>Search Results</h3>
                        </div>
                        <div class="col-md-6 text-right">
                            <h3>
                                <a href="javascript:void(0);">
                                    <i class="fa fa-search card-title text-orange"/>
                                </a>
                            </h3>
                        </div>
                    </div>
                    <div class="card-body" v-if="searchResult && searchResult.blocks.length === 0
                    && searchResult.txns.length === 0
                    && searchResult.leases.length === 0">
                        <h3 class="text-muted text-center">Nothing found</h3>
                    </div>
                    <div class="card-body m-t-0 p-0" v-else>
                        <div class="table-responsive blocks">
                            <table class="table v-middle">
                                <tbody v-if="searchResult">
                                <tr v-for="block in searchResult.blocks">
                                    <td>
                                        <router-link :to="{ name : 'block' , params: { number: block.number }}">
                                            <h4>Block: {{block.number}}</h4>
                                            <small class="text-secondary">
                                                <span class="font-weight-bold">Hash :</span> {{block.hash}} |
                                                <span class="font-weight-bold">Timestamp :</span> {{block.timestamp}}
                                            </small>
                                        </router-link>
                                    </td>
                                </tr>
                                <tr v-for="txn in searchResult.txns">
                                    <td>
                                        <router-link :to="{ name : 'transaction' , params: { number: txn.hash }}">
                                            <h4>Transaction: {{txn.hash}}</h4>
                                            <small class="text-secondary">
                                                <span class="font-weight-bold">Module :</span> {{txn.method.section}} |
                                                <span class="font-weight-bold">Method :</span> {{txn.method.method}} |
                                                <span class="font-weight-bold">Signer :</span> {{txn.signer}}
                                            </small>
                                        </router-link>
                                    </td>
                                </tr>
                                <tr v-for="lease in searchResult.leases">
                                    <td>
                                        <router-link :to="{ name : 'lease' , params: { leaseid: lease.lease_id }}">
                                            <h4>Lease: {{lease.lease_id}}</h4>
                                            <small class="text-secondary">
                                                <span class="font-weight-bold">Block :</span> {{lease.blockNumber}} |
                                                <span class="font-weight-bold">Contract No :</span> {{lease.contract_number}} |
                                                <span class="font-weight-bold">Registry Id :</span> {{lease.allocations[0].registry_id}} |
                                                <span class="font-weight-bold">Asset Id :</span> {{lease.allocations[0].asset_id}} |
                                            </small>
                                        </router-link>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../event-bus";
    import io from 'socket.io-client';
    import Age from "./common/Age";

    export default {
        name: "Home",
        components: {Age},
        data() {
            return {
                blocks: [],
                searchCriteria: null,
                searchResult: null,
                socket: null,
                latestBlockTime: '',
                lastSyncedblock: null
            };
        },
        watch: {
            lastSyncedblock: function(nv, ov) {
                if(nv !== ov) {
                    if(ov) {
                        if(ov.block.hash !== nv.block.hash) {
                            this.pushBlock(nv);
                        }
                    } else {
                        this.pushBlock(nv);
                    }
                }
            },
            searchCriteria: function(nv, ov) {
                if(nv !== ov) {
                    if(nv) {
                        this.search();
                    } else {
                        this.clear();
                    }
                }
            }
        },
        mounted() {
            window.onbeforeunload = function(event) {
                console.log("Disconnecting socket on page refresh or close");
                if(this.socket) {
                    this.socket.disconnect();
                }
            };
            this.init();
        },
        destroyed() {
            console.log("Disconnecting socket on destroy");
            if(this.socket) {
                this.socket.disconnect();
            }
        },
        methods: {
            async init() {
                await this.getRecentBlocks();

                this.socket = await io(process.env.VUE_APP_API_URL);

                this.socket.on('connect', () => {
                    //console.log("Socket connection established");
                    this.getLatestBlocks();
                });
            },
            async getRecentBlocks() {
                try {
                    EventBus.$emit('show');
                    let reply   = await this.$http.get("/blocks");
                    this.blocks = reply.data.slice;
                } catch(e) {

                } finally {
                    EventBus.$emit('hide');
                }
            },
            async search() {
                let reply         = await this.$http.get("/search", {params: {searchCriteria: this.searchCriteria}});
                this.searchResult = reply.data;
            },
            clear() {
                this.searchResult   = null;
                this.searchCriteria = null;
            },
            async getLatestBlocks() {
                this.socket.on('block updated', (data) => {
                    //console.log("New Block Number : ", data.block.blockNumber);
                    this.lastSyncedblock = data;
                })
            },
            pushBlock(arg) {
                // console.log("New Block Number : ", JSON.stringify(arg));
                if(this.blocks.length > 9) {
                    this.blocks.pop();
                }
                this.blocks.unshift(arg.block);
                this.latestBlockTime = arg.block.timestamp;
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