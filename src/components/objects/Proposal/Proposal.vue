<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Proposal</h4>
                </div>
                <div class="card-header-icon">
                    <h3><i class="fas fa-list-alt card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Proposal Id</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="show">
                        <dd class="mb-1">{{proposal.id}}</dd>
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
                                <router-link :to="{ name : 'block', params: {number: proposal.blockNumber}}">{{proposal.blockNumber}}</router-link>
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
                                <router-link :to="{ name : 'block', params: {number: proposal.blockNumber}}">{{proposal.blockHash}}</router-link>
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
                                <router-link :to="{ name : 'transaction-from-chain', params: {blockhash: proposal.blockHash, txhash: proposal.extrinsicHash}}">{{proposal.extrinsicHash}}</router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                </template>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Proposal Creator</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <Blockie :address="proposal.proposer" class="mm-5-0-5-0"/>
                            <span :title="proposal.proposer" class="m-l-5 align-middle">
                                <router-link :to="{ name : 'view-account' , params: { address: proposal.proposer }}">
                                    {{ proposal.proposer }}</router-link>
                            </span>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Group Involved</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <span :title="proposal.group_id" class="m-l-5 align-middle">
                                <router-link :to="{name: 'group', params: {groupid: proposal.group_id}}">{{proposal.group_id}}</router-link>
                            </span>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Created at</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">{{proposal.timestamp | from_ms}}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Proposal Activities</h4>
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
                                <router-link :to="{ name: 'transaction-from-chain', params: { blockhashornumber: proposal.blockNumber, txhash: activity.hash}}"
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
                        Fetching proposal, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound module="Proposal" :module-id="proposalid" v-if="flag === 'FAILURE'"/>
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
        name: "Proposal",
        props: ["proposalid", "hideChainDetails"],
        components: {Blockie, NotFound},
        data() {
            return {
                proposal: null,
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
                await this.getProposal();
                await this.getProposalActivities();
            },
            async getProposal() {
                if(this.proposalid !== null) {
                    try {
                        EventBus.$emit('show');
                        let reply  = await this.$http.get(`/proposals/${this.proposalid}`);
                        this.proposal = reply.data;
                        if(this.proposal) {
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
            async getProposalActivities() {
                if(this.proposal) {
                    try {
                        let reply       = await this.$http.get(`/proposals/${this.proposalid}/activities`);
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
