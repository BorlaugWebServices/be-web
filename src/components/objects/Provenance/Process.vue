<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Chain of Custody</h4>
                </div>
                <div class="card-header-icon">
                    <h3><i class="fas fa-route card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Process Id</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="show">
                        <dd class="mb-1">{{sequence.id}}</dd>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-else>
                        <router-link :to="{name: 'process', params : { processid: sequence.id }}">
                            <dd class="mb-1">{{sequence.id}}</dd>
                        </router-link>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Process Name</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{sequence.name}}</dd>
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
                                <router-link v-if="sequence.blockNumber"
                                             :to="{ name : 'block', params: {number: sequence.blockNumber}}">
                                    {{sequence.blockNumber}}
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
                                <router-link v-if="sequence.blockHash"
                                             :to="{ name : 'block', params: {number: sequence.blockHash}}">
                                    {{sequence.blockHash}}
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
                                <router-link v-if="sequence.extrinsicHash"
                                             :to="{ name : 'transaction-from-chain', params: {blockhash: sequence.blockHash, txhash: sequence.extrinsicHash}}">
                                    {{sequence.extrinsicHash}}
                                </router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                </template>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt class="mb-1">Process Creator</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <router-link :to="{name: 'identity', params : { did: getDid(sequence.sequence_creator) }}">
                            <Blockie :address="sequence.sequence_creator" class="mm-5-0-5-0 float-left"/>
                            <dd class="ml-2 float-left" v-if="isMobile">{{sequence.sequence_creator | did | truncate(32, '...')}}</dd>
                            <dd class="ml-2 float-left" v-else>{{sequence.sequence_creator }}</dd>
                        </router-link>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Registry Id</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{sequence.registry}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Process Definition Id</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{sequence.template}}</dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Progress</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <div id="accordion" class="accordion" role="tablist" aria-multiselectable="true">
                            <div class="card" v-for="(step,index) in sequence.steps">
                                <div class="card-header" role="tab" id="headingOne">
                                    <a data-toggle="collapse" :href="'#step'+index" aria-expanded="true"
                                       :class="{ 'collapsed': !shouldExpand(index) }" :aria-controls="'step'+index">
                                        {{step.name}}
                                        <span class="badge badge-pill badge-success font-bold ml-2" v-if="step.status === 'ATTESTED'">
                                            <i class="fa fa-certificate"/> Attested
                                        </span>
                                        <span class="badge badge-pill badge-warning font-bold ml-2" v-if="step.status === 'IN_PROGRESS'">
                                            <i class="fa fa-spinner fa-spin"/> In Progress
                                        </span>
                                        <span class="badge badge-pill badge-secondary font-bold ml-2" v-if="step.status === 'PENDING'">
                                            <i class="fa fa-hourglass-half"/> Pending
                                        </span>
                                    </a>
                                </div><!-- card-header -->

                                <div :id="'step'+index" data-parent="#accordion" class="collapse" :class="{ 'show': shouldExpand(index) }" role="tabpanel">
                                    <div class="card-body border bg-white">
                                        <template v-if="step.status === 'ATTESTED'">
                                            <h5 class="mt-2">Attestations</h5>
                                            <table class="table table-bordered mb-0">
                                                <tr>
                                                    <th class="p-2 font-bold w-50">Name</th>
                                                    <th class="p-2 font-bold w-50">Fact</th>
                                                </tr>
                                                <tr v-for="att in step.attributes">
                                                    <td class="p-2">{{att.name | hexcheck}}</td>
                                                    <td class="p-2" v-if="att.fact && att.fact.Text && isUrl(att.fact.Text)">
                                                        <a target="_blank" v-bind:href="att.fact.Text">View Details</a>
                                                    </td>
                                                    <td class="p-2" v-else>{{att.fact | fact}}</td>
                                                </tr>
                                            </table>
                                            <h5 class="mt-2">Attested By {{step.attestor.short_name}}</h5>
                                            <router-link :to="{name: 'identity', params : { did: getDid(step.attestor.did.id) }}">
                                                <Blockie :address="step.attested_by.id" class="mm-5-0-5-0 float-left"/>
                                                <dd class="ml-2 float-left" v-if="isMobile">{{step.attestor.did.id | did | truncate(25, '...')}}</dd>
                                                <dd class="ml-2 float-left" v-else>{{step.attestor.did.id | did }}</dd>
                                            </router-link>
                                            <div class="clearfix"></div>
                                        </template>
                                        <template v-if="step.status === 'IN_PROGRESS'">
                                            <h5 class="text-muted mt-3 mb-0">This step is in progress</h5>
                                        </template>
                                        <template v-if="step.status === 'PENDING'">
                                            <h5 class="text-muted mt-3 mb-0">This step is pending</h5>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </dl>
            </div>
        </div>

        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Process Activities</h4>
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
                                <router-link :to="{ name: 'transaction-from-chain', params: { blockhashornumber: sequence.blockNumber, txhash: activity.hash }}"
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
                        Fetching sequence, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound module="Sequnece" :module-id="processid" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isMobile} from 'mobile-device-detect';
    import _ from "lodash";
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie";
    import NotFound from "../../common/NotFound";

    export default {
        name: "Process",
        props: ["processid", "hideChainDetails"],
        components: {Blockie, NotFound},
        data() {
            return {
                isMobile: isMobile,
                sequence: {
                    id: 0,
                    name: null,
                    blockNumber: null,
                    blockHash: null,
                    extrinsicHash: null,
                    sequence_creator: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    steps: []
                },
                activities: [],
                show: false,
                flag: 'SUCCESS'
            }
        },
        mounted() {
            this.show = !this.hideChainDetails;
            this.init();
        },
        methods: {
            isUrl(value) {
                let r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
                return r.test(value);
            },
            async init() {
                await this.getProvenace();
                await this.getProvenaceActivities();
            },
            async getProvenace() {
                if(this.auditid !== null) {
                    try {
                        EventBus.$emit('show');
                        let reply     = await this.$http.get(`/sequences/${this.processid}`);
                        this.sequence = reply.data;
                        if(this.sequence) {
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
            async getProvenaceActivities() {
                if(this.sequence) {
                    try {
                        let reply       = await this.$http.get(`/sequences/${this.processid}/activities`);
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
            },
            /*
            returns true if index of last OPEN status, else returns true if index is 0, otherwise false
             */
            shouldExpand(index) {
                let i = _.findLastIndex(this.sequence.steps, ['status', 'ATTESTED']);

                if(i !== -1) {
                    return i === index;
                } else {
                    return index === 0;
                }
            }
        }
    }
</script>

<style scoped>
    td {
        word-break: break-all;
    }
</style>
