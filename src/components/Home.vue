<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <ExplorerCard cardClass="text-white bg-light" noHeader>
                    <h4 class="card-title text-dark m-b-20">Explore Blocks, Transactions and Addresses</h4>
                    <div class="input-group">
                        <input aria-describedby="button-header-search" autocomplete="off" autofocus=""
                               class="form-control form-control--focus-white searchautocomplete ui-autocomplete-input"
                               id="searchCriteria" name="searchCriteria"
                               placeholder="Search by Block Number / Txhash / Registry / Asset / Lease / Catalog / DID / Audit / Provenance / Account / Group / Proposal / Event"
                               type="text" v-model="searchCriteria">
                        <div class="input-group-append" v-if="searchResult">
                            <button @click="clear" class="btn btn-orange text-white font-weight-bold" type="submit">
                                <i class="fa fa-search d-inline-block d-sm-none"></i><span
                                    class="d-none d-sm-inline-block">Clear</span>
                            </button>
                        </div>
                    </div>
                </ExplorerCard>
            </div>
        </div>

        <div class="row" v-if="!searchCriteria">
            <div class="col-md-6">
                <LatestDataTable title="Latest Blocks" icon="fa fa-cubes" :headers="['Number', 'Age', 'Transactions', 'Events']" :items="blocks">
                    <template #body="{ items }">
                        <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(block, index) in items">
                            <td>
                                <i class="fa fa-cube"></i>
                            </td>
                            <td>
                                <div class="d-flex no-block align-items-center">
                                    <router-link :to="{name: 'block', params: {number: block.number}}">{{
                                        block.number}}
                                    </router-link>
                                </div>
                            </td>
                            <td>
                                <age :timestamp="block.timestamp" v-if="block.timestamp"/>
                            </td>
                            <td>
                                {{block.transactions.length}}
                            </td>
                            <td>
                                {{block.events.length}}
                            </td>
                            <td class="text-right">
                                <router-link :to="{name: 'block', params: {number: block.number}}"
                                             class="btn btn-sm btn-orange text-white">
                                    Details
                                </router-link>
                            </td>
                        </tr>
                    </template>
                    <template #footer>
                        <div class="m-b-10">Last Synced Block Time: <strong v-if="latestBlockTime">{{ formatters.timestamp(latestBlockTime.toString()) }}</strong></div>
                        <router-link :to="{name: 'blocks'}"
                                     class="btn btn-orange btn-block text-white font-weight-bold">View All Blocks
                        </router-link>
                    </template>
                </LatestDataTable>
            </div>

            <div class="col-md-6">
                <LatestDataTable title="Latest Transactions" icon="fas fa-file-signature" :headers="['Hash', 'Block', 'Method']" :items="transactions">
                    <template #body="{ items }">
                        <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(tx, index) in items">
                            <td>
                                <i class="fas fa-file-signature"></i>
                            </td>
                            <td>
                                <div :title="tx.hash" class="d-flex no-block align-items-center">
                                    <router-link
                                            :to="{name: 'transaction-from-chain', params: {blockhashornumber: tx.blockNumber, txhash: tx.hash}}">
                                        {{ formatters.truncate(tx.hash, 8, '...') }}
                                    </router-link>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex no-block align-items-center">
                                    <router-link :to="{name: 'block', params: {number: tx.blockNumber}}">{{
                                        tx.blockNumber}}
                                    </router-link>
                                </div>
                            </td>
                            <td>
                                {{tx.method.method}}
                            </td>
                            <td class="text-right">
                                <router-link
                                        :to="{name: 'transaction-from-chain', params: {blockhashornumber: tx.blockNumber, txhash: tx.hash}}"
                                        class="btn btn-sm btn-orange text-white">
                                    Details
                                </router-link>
                            </td>
                        </tr>
                    </template>
                    <template #footer>
                        <div class="m-b-10">Last Synced Transaction Time: <strong v-if="latestTxnTime">{{ formatters.timestamp(latestTxnTime.toString()) }}</strong></div>
                        <router-link :to="{name: 'transactions'}"
                                     class="btn btn-orange btn-block text-white font-weight-bold">View All Transaction
                        </router-link>
                    </template>
                </LatestDataTable>
            </div>
        </div>

        <div class="row" v-else>
            <div class="col-md-12">
                <SearchResults v-if="searchResult" :searchResult="searchResult" @clear-search="clear" />
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../event-bus";
    import io from 'socket.io-client';
    import Age from "./common/Age.vue";
    import ExplorerCard from "./common/ExplorerCard.vue";
    import SearchResults from "@/components/common/SearchResults.vue";
    import LatestDataTable from "@/components/common/LatestDataTable.vue";
    import { formatters } from "@/utils/formatters";

    export default {
        name: "Home",
        components: {Age, ExplorerCard, SearchResults, LatestDataTable},
        data() {
            return {
                blocks: [],
                transactions: [],
                searchCriteria: null,
                searchResult: null,
                socket: null,
                latestBlockTime: '',
                lastSyncedBlock: null,
                latestTxnTime: '',
                lastSyncedTxn: null,
                timestamp: null,
                alert_sent: false,
                counter: 0,
                formatters: formatters
            };
        },
        watch: {
            counter: async function (nv, ov) {
                if (nv !== ov && nv === 1) {
                    await this.sendAlert(nv);
                }
            },
            lastSyncedBlock: function (nv, ov) {
                if (nv !== ov) {
                    if (ov) {
                        if (ov.block.hash !== nv.block.hash) {
                            this.pushBlock(nv);
                        }
                    } else {
                        this.pushBlock(nv);
                    }
                }
            },
            lastSyncedTxn: function (nv, ov) {
                if (nv !== ov) {
                    if (ov) {
                        if (ov.hash !== nv.hash) {
                            this.pushTxn(nv);
                        }
                    } else {
                        this.pushTxn(nv);
                    }
                }
            },
            searchCriteria: function (nv, ov) {
                if (nv !== ov) {
                    if (nv) {
                        this.search();
                    } else {
                        this.clear();
                    }
                }
            }
        },
      mounted() {
        window.onbeforeunload = function (event) {
          if (this.socket) {
            this.socket.disconnect();
          }
        };
        this.init();

        // Monitor for chain stalls (no new blocks for 10 minutes)
        setInterval(() => {
          if (!this.latestBlockTime) return;

          const TEN_MINUTES_MS = 10 * 60 * 1000;
          const now = Date.now();
          const blockTime = Number(this.latestBlockTime);
          const diff = now - blockTime;

          if (diff > TEN_MINUTES_MS) {
            // If the last block is more than 10 mins old, increment counter
            this.counter++;
            console.warn(`Chain Stall Alert: Last block was ${Math.floor(diff / 60000)} minutes ago.`);
          } else {
            // Reset counter if the chain is moving again
            this.counter = 0;
          }
        }, 5000); // Check every 5 seconds
      },
        unmounted() {
            if (this.socket) {
                this.socket.disconnect();
            }
        },
        methods: {
            async sendAlert() {
                try {
                    await this.axios.post(`email/chainalert`);
                } catch (e) {
                }
            },
            async init() {
                try {
                    EventBus.emit('show');
                    await Promise.all([
                        this.getRecentBlocks(),
                        this.getRecentTxns()
                    ])
                    this.socket = await io(process.env.VUE_APP_AZTEC_API_URL);
                    this.socket.on('connect', () => {
                        this.getLatestBlocks();
                        this.getLatestTxns();
                    });
                } catch (e) {
                    this.unmounted();
                    console.error(e);
                } finally {
                    EventBus.emit('hide');
                }
            },
            async getRecentBlocks() {
                let reply = await this.axios.get("/blocks");
                this.blocks = reply.data.slice;
                if (this.blocks.length > 0) {
                    this.latestBlockTime = this.blocks[0].timestamp;
                }
            },
            async getRecentTxns() {
                let reply = await this.axios.get("/transactions");
                this.transactions = reply.data.slice;
                if (this.transactions.length > 0) {
                    this.latestTxnTime = this.transactions[0].timestamp;
                }
            },
            async search() {
                let reply = await this.axios.get("/search", {params: {searchCriteria: this.searchCriteria}});
                this.searchResult = reply.data;
            },
            clear() {
                this.searchResult = null;
                this.searchCriteria = null;
            },
            async getLatestBlocks() {
                this.socket.on('block updated', (data) => {
                    console.log("New Block Number : ", data.hash);
                    this.lastSyncedBlock = data;
                })
            },
            getLatestTxns() {
                this.socket.on('txn updated', (data) => {
                    console.log("Txn Updated : ", data);
                    this.lastSyncedTxn = data;
                })
            },
            pushBlock(arg) {
                // console.log("New Block Number : ", JSON.stringify(arg));
                if (this.blocks.length > 9) {
                    this.blocks.pop();
                }
                this.blocks.unshift(arg.block);
                this.latestBlockTime = arg.block.timestamp;
            },
            pushTxn(txn) {
                // console.log("New Txn : ", JSON.stringify(txn));
                if (this.transactions.length > 9) {
                    this.transactions.pop();
                }
                this.transactions.unshift(txn);
                this.latestTxnTime = txn.timestamp;
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
