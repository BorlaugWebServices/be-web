<template>
    <div v-if="flag === 'SUCCESS'">
        <ExplorerCard title="Provenance" icon-class="fas fa-route" cardClass="mb-4">
            <DetailItem title="Process Id" v-if="show">
                {{sequence.id}}
            </DetailItem>
            <DetailItem title="Process Id" v-else>
                <router-link :to="{name: 'process', params : { processid: sequence.id }}">
                    {{sequence.id}}
                </router-link>
            </DetailItem>
            <DetailItem title="Process Name">
                {{sequence.name}}
            </DetailItem>
            <template v-if="show">
                <DetailItem title="Block Number">
                    <router-link v-if="sequence.blockNumber"
                                 :to="{ name : 'block', params: {number: sequence.blockNumber}}">
                        {{sequence.blockNumber}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Block Hash">
                    <router-link v-if="sequence.blockHash"
                                 :to="{ name : 'block', params: {number: sequence.blockHash}}">
                        {{sequence.blockHash}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Transaction Hash">
                    <router-link v-if="sequence.extrinsicHash"
                                 :to="{ name : 'transaction-from-chain', params: {blockhash: sequence.blockHash, txhash: sequence.extrinsicHash}}">
                        {{sequence.extrinsicHash}}
                    </router-link>
                </DetailItem>
            </template>
            <DetailItem title="Process Creator">
                <router-link :to="{name: 'view-account',params: { address: sequence.sequence_creator }}">
                    <Blockie :address="sequence.sequence_creator" class="mm-5-0-5-0 float-left"/>
                    <dd class="ml-2 float-left">{{sequence.sequence_creator }}</dd>
                </router-link>
            </DetailItem>
            <DetailItem title="Registry Id">
                {{sequence.registry}}
            </DetailItem>
            <DetailItem title="Process Definition Id">
                {{sequence.template}}
            </DetailItem>
            <DetailItem title="Created at">
                {{ formatters.from_ms(sequence.timestamp) }}
            </DetailItem>
            <DetailItem title="Progress" :noSeparator="true">
                <div id="accordion" class="accordion" role="tablist" aria-multiselectable="true">
                    <div class="card" v-for="(step,index) in sequence.steps">
                        <div class="card-header" role="tab" id="headingOne">
                            <a data-toggle="collapse" :href="'#step'+index" aria-expanded="true"
                               :class="{ 'collapsed': !shouldExpand(index) }" :aria-controls="'step'+index">
                                {{step.name}}
                                <span class="badge rounded-pill bg-success font-weight-bold ml-2" v-if="step.status === 'ATTESTED'">
                                    <i class="fa fa-certificate"/> Attested
                                </span>
                                <span class="badge rounded-pill bg-warning font-weight-bold ml-2" v-if="step.status === 'IN_PROGRESS'">
                                    <i class="fa fa-spinner fa-spin"/> In Progress
                                </span>
                                <span class="badge rounded-pill bg-secondary font-weight-bold ml-2" v-if="step.status === 'PENDING'">
                                    <i class="fa fa-hourglass-half"/> Pending
                                </span>
                            </a>
                        </div><!-- card-header -->

                        <div :id="'step'+index" data-parent="#accordion" class="collapse" :class="{ 'show': shouldExpand(index) }" role="tabpanel">
                            <div class="card-body border bg-white">
                                <template v-if="step.status === 'ATTESTED'">
                                    <h5 class="mt-2">Attestations</h5>
                                    <table class="table table-bordered mb-0">
                                      <thead>
                                        <tr>
                                            <th class="p-2 font-weight-bold w-50">Name</th>
                                            <th class="p-2 font-weight-bold w-50">Fact</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="att in step.attributes">
                                            <td class="p-2">{{ formatters.hexcheck(att.name) }}</td>
                                            <td class="p-2">{{ formatters.fact(att.fact) }}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <h5 class="mt-2">Attested By</h5>
                                    <router-link :to="{name: 'view-account',params: { address: step.attestor }}">
                                        <Blockie :address="step.attestor" class="mm-5-0-5-0 float-left"/>
                                        <dd class="ml-2 float-left">
                                            {{step.attestor}}
                                        </dd>
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
            </DetailItem>
        </ExplorerCard>

        <ExplorerCard title="Process Activities" icon-class="fas fa-list-alt">
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
                        <td>{{activity.method.args[1].method ? activity.method.args[1].method : activity.method.method}}</td>
                        <td>
                            <router-link :to="{ name: 'transaction-from-chain', params: { blockhashornumber: sequence.blockNumber, txhash: activity.hash }}"
                                         :title="activity.hash">
                                {{ formatters.truncate(activity.hash, 32, '') }}
                            </router-link>
                        </td>
                        <td>
                          <StatusBadge :success="activity.isSuccess" />
                        </td>
                        <td>{{ formatters.timestamp(activity.timestamp.toString()) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-b-10" v-else>
                <h4 class="text-muted text-center">No Activities found</h4>
            </div>
        </ExplorerCard>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <ExplorerCard>
                <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                    Fetching sequence, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound module="Sequnece" :module-id="processid" v-if="flag === 'FAILURE'"/>
            </ExplorerCard>
        </div>
    </div>
</template>

<script>
    import {isMobile} from 'mobile-device-detect';
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie.vue";
    import NotFound from "../../common/NotFound.vue";
    import DetailItem from "../../common/DetailItem.vue";
    import ExplorerCard from "@/components/common/ExplorerCard.vue";
    import { formatters } from "@/utils/formatters";
    import StatusBadge from "@/components/common/StatusBadge.vue";

    export default {
        name: "Process",
        props: ["processid", "hideChainDetails"],
        components: {StatusBadge, Blockie, NotFound, DetailItem, ExplorerCard},
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
                flag: 'SUCCESS',
                formatters: formatters
            }
        },
        mounted() {
            this.show = !this.hideChainDetails;
            this.init();
        },
        methods: {
            async init() {
                await this.getProvenace();
                await this.getProvenaceActivities();
            },
            async getProvenace() {
                if(this.auditid !== null) {
                    try {
                        EventBus.emit('show');
                        let reply     = await this.axios.get(`/sequences/${this.processid}`);
                        this.sequence = reply.data;
                        if(this.sequence) {
                            this.flag = 'SUCCESS';
                        } else {
                            this.flag = 'FAILURE';
                        }
                    } catch(e) {
                        this.flag = 'FAILURE';
                    } finally {
                        EventBus.emit('hide');
                    }
                }
            },
            async getProvenaceActivities() {
                if(this.sequence) {
                    try {
                        let reply       = await this.axios.get(`/sequences/${this.processid}/activities`);
                        this.activities = reply.data.sort((a, b) => a.timestamp - b.timestamp);
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
                return formatters.did(did);
            },
            /*
            returns true if index of last OPEN status, else returns true if index is 0, otherwise false
             */
            shouldExpand(index) {
                let i = -1;
                for (let k = this.sequence.steps.length - 1; k >= 0; k--) {
                    if (this.sequence.steps[k].status === 'ATTESTED') {
                        i = k;
                        break;
                    }
                }

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
