<template>
    <div v-if="flag === 'SUCCESS'">
        <ExplorerCard title="Group" icon-class="fas fa-id-card" cardClass="mb-4">
            <DetailItem title="ID" v-if="show">
                <router-link :to="{name: 'group', params: {groupid: groupid}}">{{groupid}}</router-link>
            </DetailItem>
            <DetailItem title="Name">
                {{group.name}}
            </DetailItem>
            <DetailItem title="Address" v-if="show">
                <router-link :to="{name: 'view-account',params: { address: group.anonymous_account }}">
                    <Blockie :address="group.anonymous_account" class="mm-5-0-5-0 float-left"/>
                    <dd class="ml-2 float-left">{{group.anonymous_account}}</dd>
                </router-link>
            </DetailItem>
            <DetailItem title="Total Vote Weight">
                {{group.total_vote_weight}}
            </DetailItem>
            <DetailItem title="Threshold">
                {{group.threshold}}
            </DetailItem>
            <template v-if="show">
                <DetailItem title="Block Number">
                    <router-link :to="{ name : 'block', params: {number: group.blockNumber}}">
                        {{group.blockNumber}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Block Hash">
                    <router-link :to="{ name : 'block', params: {number: group.blockNumber}}">
                        {{group.blockHash}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Transaction Hash">
                    <router-link
                            :to="{ name : 'transaction-from-chain', params: {blockhash: group.blockHash, txhash: group.extrinsicHash}}">
                        {{group.extrinsicHash}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Created at">
                    {{ formatters.from_ms(group.timestamp) }}
                </DetailItem>
            </template>
            <DetailItem title="Members" v-if="group && group.members" :noSeparator="true">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                        <th class="p-2 font-weight-bold">Account</th>
                        <th class="p-2 font-weight-bold">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prop in group.members">
                        <td class="p-2">
                            <router-link :to="{name: 'view-account',params: { address: prop.account }}">
                                <Blockie :address="prop.account" class="mm-5-0-5-0 float-left mr-2"/>
                                {{prop.account}}
                            </router-link>
                        </td>
                        <td class="p-2">{{prop.weight}}</td>
                    </tr>
                  </tbody>
                </table>
            </DetailItem>
        </ExplorerCard>

        <ExplorerCard title="Group Activities" icon-class="fas fa-list-alt">
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
                            <router-link
                                    :title="activity.hash"
                                    :to="{ name: 'transaction-from-chain', params: { blockhashornumber: group.blockNumber, txhash: activity.hash}}">
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
                    Fetching group, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound :module-id="groupid" module="Group" v-if="flag === 'FAILURE'"/>
            </ExplorerCard>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie.vue";
    import NotFound from "../../common/NotFound.vue";
    import DetailItem from "../../common/DetailItem.vue";
    import ExplorerCard from "@/components/common/ExplorerCard.vue";
    import { formatters } from "@/utils/formatters";
    import StatusBadge from "@/components/common/StatusBadge.vue";

    export default {
        name: "Groups",
        props: ["groupid", "hideChainDetails"],
        components: {Blockie, NotFound, DetailItem, ExplorerCard, StatusBadge},
        data() {
            return {
                group: null,
                activities: [],
                show: false,
                flag: 'SEARCHING',
                formatters: formatters
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
                        EventBus.emit('show');
                        let reply = await this.axios.get(`/groups/${this.groupid}`);
                        this.group = reply.data;
                        if (this.group) {
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
            async getGroupActivities() {
                if (this.group) {
                    try {
                        let reply = await this.axios.get(`/groups/${this.groupid}/activities`);
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
        }
    }
</script>

<style scoped>

</style>
