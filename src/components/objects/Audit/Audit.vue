<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Audit</h4>
                </div>
                <div class="card-header-icon">
                    <h3><i class="fas fa-list-alt card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Audit Id</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="show">
                        <dd class="mb-1">{{audit.id}}</dd>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-else>
                        <router-link :to="{name: 'audit', params : { auditid: audit.id }}">
                            <dd class="mb-1">{{audit.id}}</dd>
                        </router-link>
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
                                <router-link :to="{ name : 'block', params: {number: audit.blockNumber}}">{{audit.blockNumber}}</router-link>
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
                                <router-link :to="{ name : 'block', params: {number: audit.blockNumber}}">{{audit.blockHash}}</router-link>
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
                                <router-link :to="{ name : 'transaction-from-chain', params: {blockhash: audit.blockHash, txhash: audit.extrinsicHash}}">{{audit.extrinsicHash}}</router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                </template>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Audit Creator</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <Blockie :address="audit.audit_creator" class="mm-5-0-5-0"/>
                            <span :title="audit.audit_creator" class="m-l-5 align-middle">{{ audit.audit_creator }}</span>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Auditor</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <Blockie :address="audit.auditor" class="mm-5-0-5-0"/>
                            <span :title="audit.auditor" class="m-l-5 align-middle">{{ audit.auditor }}</span>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Audit Activities</h4>
                </div>
                <div class="card-header-icon">
                    <h3><i class="fas fa-list-altcard-title text-orange"/></h3>
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
                                <router-link :to="{ name: 'transaction-from-chain', params: { blockhashornumber: audit.blockNumber, txhash: activity.hash}}"
                                             :title="activity.hash">
                                    {{activity.hash | truncate(32, '')}}
                                </router-link>
                            </td>
                            <td>
                                <span class="badge badge-pill badge-success font-bold" v-if="activity.isSuccess">
                                    <i class="fa fa-check-circle"/> SUCCESS
                                </span>
                                <span class="badge badge-pill badge-danger font-bold" v-else>
                                    <i class="fas fa-exclamation-circle"></i> FAILED
                                </span>
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
                        Fetching audit, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound module="Audit" :module-id="auditid" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from "lodash";
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie";
    import NotFound from "../../common/NotFound";

    export default {
        name: "Audit",
        props: ["auditid", "hideChainDetails"],
        components: {Blockie, NotFound},
        data() {
            return {
                audit: null,
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
                await this.getAudit();
                await this.getAuditActivities();
            },
            async getAudit() {
                if(this.auditid !== null) {
                    try {
                        EventBus.$emit('show');
                        let reply  = await this.$http.get(`/audits/${this.auditid}`);
                        this.audit = reply.data;
                        if(this.audit) {
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
            async getAuditActivities() {
                if(this.audit) {
                    try {
                        let reply       = await this.$http.get(`/audits/${this.auditid}/activities`);
                        this.activities = _.orderBy(reply.data, ["timestamp"], ["asc"]);
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
            },
            getDid(did) {
                return this.$options.filters.did(did);
            }
        }
    }
</script>

<style scoped>

</style>
