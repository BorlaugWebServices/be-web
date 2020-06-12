<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Lease</h4>
                </div>
                <div class="card-header-icon">
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
                        <dd class="mb-1">{{lease.contractNumber}}</dd>
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
                                <router-link :to="{ name : 'block', params: {number: lease.blockNumber}}">{{lease.blockNumber}}</router-link>
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
                                <router-link :to="{ name : 'block', params: {number: lease.blockNumber}}">{{lease.blockHash}}</router-link>
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
                                <router-link :to="{ name : 'transaction', params: {hash: lease.extrinsicHash}}">{{lease.extrinsicHash}}</router-link>
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
                        <dd class="mb-1">
                            <Blockie :address="lease.lessor.id" class="mm-5-0-5-0"/>
                            <span class="m-l-5 align-middle"> {{lease.lessor.id | did}}</span>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Lessee</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <Blockie :address="lease.lessee.id" class="mm-5-0-5-0"/>
                            <span class="m-l-5 align-middle"> {{lease.lessee.id | did}}</span>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Effective From</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.effectiveTs | date}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Effective To</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.expiryTs | date}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Registry ID</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.allocations[0].registry_id}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Asset ID</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.allocations[0].asset_id}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Asset Name</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.asset.number}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Asset Origin</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.asset.origin}}, {{lease.asset.country}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Allocation</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{lease.allocations[0].allocated_shares}}%</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Lease Activities</h4>
                </div>
                <div class="card-header-icon">
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
                            <th class="border-top-0 font-weight-bold">Tx</th>
                            <th class="border-top-0 font-weight-bold">Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(activity,i) in activities">
                            <td>{{i+1 }}</td>
                            <td>{{activity.method.method}}</td>
                            <td>
                                <router-link :to="{ name: 'transaction', params: { hash: activity.hash }}">
                                    {{activity.hash}}
                                </router-link>
                            </td>
                            <td>{{activity.timestamp.toString() | timestamp}}</td>
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
                    <h4 class="card-title text-muted" v-if="flag === 'FAILURE'">
                        Lease "{{leaseid}}" not found
                    </h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie";

    export default {
        name: "Lease",
        props: ["leaseid", "hideChainDetails"],
        components: {Blockie},
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
                if(this.leaseid !== null) {
                    try {
                        EventBus.$emit('show');
                        let reply  = await this.$http.get(`/leases/${this.leaseid}`);
                        this.lease = reply.data;
                        if(this.lease) {
                            this.flag = 'SUCCESS';
                        } else {
                            this.flag = 'FAILURE';
                        }
                    } catch(e) {
                        this.flag = 'FAILURE';
                    } finally {
                        EventBus.$emit('hide');
                    }
                }
            },
            async getLeaseActivities() {
                if(this.lease) {
                    try {
                        let reply       = await this.$http.get(`/leases/${this.leaseid}/activities`);
                        this.activities = reply.data;
                    } catch(e) {

                    } finally {

                    }
                }
            },
            toDateString(str) {
                let seconds = Number(str.replace(/,/g, ''));
                let d       = new Date(0);
                d.setSeconds(seconds);
                return d;
            }
        }
    }
</script>

<style scoped>

</style>