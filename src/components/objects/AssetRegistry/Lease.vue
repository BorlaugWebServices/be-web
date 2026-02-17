<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="col-md-6 card-title">
                    <h4>Lease</h4>
                </div>
                <div class="col-md-6 text-right">
                    <h3><i class="fas fa-file-signature card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Lease Id</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.id}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Contract Number</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{ $filters.hexToString(lease.contract_number) }}</dd>
                    </div>
                </dl>
                <hr/>
                <template v-if="show">
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Block Number</dt>
                        </div>
                        <div class="col-sm-9 text-sm-left">
                            <dd class="mb-1">
                                <router-link :to="{ name : 'block', params: {number: lease.blockNumber}}">
                                    {{lease.blockNumber}}
                                </router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Block Hash</dt>
                        </div>
                        <div class="col-sm-9 text-sm-left">
                            <dd class="mb-1">
                                <router-link :to="{ name : 'block', params: {number: lease.blockNumber}}">
                                    {{lease.blockHash}}
                                </router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Transaction Hash</dt>
                        </div>
                        <div class="col-sm-9 text-sm-left">
                            <dd class="mb-1">
                                <router-link
                                        :to="{ name : 'transaction-from-chain', params: {blockhash: lease.blockHash, txhash: lease.extrinsicHash}}">
                                    {{lease.extrinsicHash}}
                                </router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                </template>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Lessor</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <router-link :to="{name: 'identity', params : { did: getDid(lease.lessor) }}">
                            <Blockie :address="lease.lessor" class="mm-5-0-5-0 float-left"/>
                            <dd class="ml-2 float-left">{{ $filters.did(lease.lessor) }}</dd>
                        </router-link>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Lessee</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <router-link :to="{name: 'identity', params : { did: getDid(lease.lessee) }}">
                            <Blockie :address="lease.lessee" class="mm-5-0-5-0 float-left"/>
                            <dd class="ml-2 float-left">{{ $filters.did(lease.lessee) }}</dd>
                        </router-link>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Effective From</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{ $filters.date(lease.effective_ts) }}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Effective To</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{ $filters.date(lease.expiry_ts) }}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0" v-if="lease && lease.allocations.length>0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Allocations</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <table class="table table-bordered">
                                <tr>
                                    <th class="p-2 font-bold">Asset</th>
                                    <th class="p-2 font-bold">Allocated Shares</th>
                                </tr>
                                <tr v-for="prop in lease.allocations">
                                    <td class="p-2">
                                        <router-link :to="{name: 'asset',params: { assetid: prop.asset_id }}">
                                            {{prop.asset_id}}
                                        </router-link>
                                    </td>
                                    <td class="p-2">{{prop.allocated_shares}}</td>
                                </tr>
                            </table>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="col-md-6 card-title">
                    <h4>Lease Activities</h4>
                </div>
                <div class="col-md-6 text-right">
                    <h3><i class="fas fa-file-signature card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <div class="table-responsive blocks" v-if="activities.length > 0">
                    <table class="table v-middle">
                        <thead>
                        <tr>
                            <th class="border-top-0 font-weight-bold">#</th>
                            <th class="border-top-0 font-weight-bold">Activity</th>
                            <th class="border-top-0 font-weight-bold">Transaction Hash</th>
                            <th class="border-top-0 font-weight-bold">Status</th>
                            <th class="border-top-0 font-weight-bold">Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(activity,i) in activities">
                            <td>{{i+1 }}</td>
                            <td>{{activity.method.method}}</td>
                            <td>
                                <router-link
                                        :title="activity.hash"
                                        :to="{ name: 'transaction-from-chain', params: { blockhashornumber: lease.blockNumber, txhash: activity.hash }}">
                                    {{ $filters.truncate(activity.hash, 32, '') }}
                                </router-link>
                            </td>
                            <td>
                                <span class="badge rounded-pill bg-success font-bold" v-if="activity.isSuccess">
                                    <i class="fa fa-check-circle"/> SUCCESS
                                </span>
                                <span class="badge rounded-pill bg-danger font-bold" v-else>
                                    <i class="fas fa-exclamation-circle"></i> FAILED
                                </span>
                            </td>
                            <td>{{ $filters.timestamp(activity.timestamp.toString()) }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="p-b-10" v-else>
                    <h4 class="text-muted text-center">No Activities found</h4>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                        Fetching lease, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound :module-id="leaseid" module="Lease" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie.vue";
    import NotFound from "../../common/NotFound.vue";

    export default {
        name: "Lease",
        props: ["leaseid", "hideChainDetails"],
        components: {Blockie, NotFound},
        data() {
            return {
                lease: null,
                activities: [],
                show: false,
                flag: 'SEARCHING'
            }
        },
        mounted() {
            this.show = !this.hideChainDetails;
            this.init();
        },
        methods: {
            async init() {
                await this.getLease();
                await this.getLeaseActivities();
            },
            async getLease() {
                if (this.leaseid !== null) {
                    try {
                        EventBus.emit('show');
                        let reply = await this.axios.get(`assetregistry/leases/${this.leaseid}`);
                        this.lease = reply.data;
                        if (this.lease) {
                            this.flag = 'SUCCESS';
                        } else {
                            this.flag = 'FAILURE';
                        }
                    } catch (e) {
                        this.flag = 'FAILURE';
                    } finally {
                        EventBus.emit('hide');
                    }
                }
            },
            async getLeaseActivities() {
                if (this.lease) {
                    try {
                        let reply = await this.axios.get(`assetregistry/leases/${this.leaseid}/activities`);
                        this.activities = reply.data.sort((a, b) => a.timestamp - b.timestamp);
                    } catch (e) {

                    } finally {

                    }
                }
            },
            toDateString(str) {
                let seconds = Number(str.replace(/,/g, ''));
                let d = new Date(0);
                d.setSeconds(seconds);
                return d;
            },
            getDid(did) {
                return this.$filters.did(did);
            }
        }
    }
</script>

<style scoped>

</style>
