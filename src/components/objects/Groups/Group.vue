<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Group</h4>
                </div>
                <div class="card-header-icon">
                    <h3><i class="fas fa-id-card card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>ID</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="show">
                        <dd class="mb-1">
                            <router-link :to="{name: 'groups', params: {groupid: groupid}}">{{groupid}}</router-link>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Name</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            {{group.name}}
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Address</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="show">
                        <router-link :to="{name: 'view-account',params: { address: group.anonymous_account }}">
                            <Blockie :address="group.anonymous_account" class="mm-5-0-5-0 float-left"/>
                            <dd class="ml-2 float-left">{{group.anonymous_account}}</dd>
                        </router-link>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Total Vote Weight</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            {{group.total_vote_weight}}
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Threshold</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            {{group.threshold}}
                        </dd>
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
                                <router-link :to="{ name : 'block', params: {number: group.blockNumber}}">
                                    {{group.blockNumber}}
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
                                <router-link :to="{ name : 'block', params: {number: group.blockNumber}}">
                                    {{group.blockHash}}
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
                                        :to="{ name : 'transaction-from-chain', params: {blockhash: group.blockHash, txhash: group.extrinsicHash}}">
                                    {{group.extrinsicHash}}
                                </router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                </template>
                <dl class="row mb-0" v-if="group && group.members">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Members</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <table class="table table-bordered">
                                <tr>
                                    <th class="p-2 font-bold">Account</th>
                                    <th class="p-2 font-bold">Weight</th>
                                </tr>
                                <tr v-for="prop in group.members">
                                    <td class="p-2">
                                        <router-link :to="{name: 'view-account',params: { address: prop.account }}">
                                            <Blockie :address="prop.account" class="mm-5-0-5-0 float-left mr-2"/>
                                            {{prop.account}}
                                        </router-link>
                                    </td>
                                    <td class="p-2">{{prop.weight}}</td>
                                </tr>
                            </table>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Group Activities</h4>
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
                                <router-link
                                        :title="activity.hash"
                                        :to="{ name: 'transaction-from-chain', params: { blockhashornumber: group.blockNumber, txhash: activity.hash}}">
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
                        Fetching group, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound :module-id="groupid" module="Group" v-if="flag === 'FAILURE'"/>
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
        name: "Groups",
        props: ["groupid", "hideChainDetails"],
        components: {Blockie, NotFound},
        data() {
            return {
                group: null,
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
                await this.getGroup();
                await this.getGroupActivities();
            },
            async getGroup() {
                if (this.groupid !== null) {
                    try {
                        EventBus.$emit('show');
                        let reply = await this.$http.get(`/groups/${this.groupid}`);
                        this.group = reply.data;
                        if (this.group) {
                            this.flag = 'SUCCESS';
                        } else {
                            this.flag = 'FAILURE';
                        }
                    } catch (e) {
                        this.flag = 'FAILURE';
                    } finally {
                        EventBus.$emit('hide');
                    }
                }
            },
            async getGroupActivities() {
                if (this.group) {
                    try {
                        let reply = await this.$http.get(`/groups/${this.groupid}/activities`);
                        this.activities = _.orderBy(reply.data, ["timestamp"], ["asc"]);
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
        }
    }
</script>

<style scoped>

</style>
