<template>
    <div v-if="flag === 'SUCCESS'">
        <ExplorerCard title="Asset" icon-class="fas fa-list-alt" cardClass="mb-4">
            <DetailItem title="Asset Id" v-if="show">
                {{asset.id}}
            </DetailItem>
            <DetailItem title="Asset Number" v-if="show">
                {{asset.asset_number}}
            </DetailItem>
            <DetailItem title="Asset Name" v-if="show">
                {{asset.name}}
            </DetailItem>
            <DetailItem title="Status" v-if="show">
                <span class="badge rounded-pill bg-success font-weight-bold" v-if="asset.status">
                    <i class="fa fa-check-circle"/> {{asset.status}}
                </span>
            </DetailItem>
            <DetailItem title="Total Shares" v-if="show">
                {{asset.total_shares}}
            </DetailItem>
            <DetailItem title="Residual Value" v-if="show">
                {{asset.residual_value}}
            </DetailItem>
            <DetailItem title="Purchase Value" v-if="show">
                {{asset.purchase_value}}
            </DetailItem>
            <DetailItem title="Acquired Date" v-if="show">
                {{ formatters.from_ms_to_date(Number(asset.acquired_date.replace(/,/g, ""))*1000) }}
            </DetailItem>
            <template v-if="show">
                <DetailItem title="Block Number">
                    <router-link :to="{ name : 'block', params: {number: asset.blockNumber}}">
                        {{asset.blockNumber}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Block Hash">
                    <router-link :to="{ name : 'block', params: {number: asset.blockNumber}}">
                        {{asset.blockHash}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Transaction Hash">
                    <router-link
                            :to="{ name : 'transaction-from-chain', params: {blockhash: asset.blockHash, txhash: asset.extrinsicHash}}">
                        {{asset.extrinsicHash}}
                    </router-link>
                </DetailItem>
            </template>
            <DetailItem title="Created at">
                {{ formatters.from_ms(asset.timestamp) }}
            </DetailItem>
            <DetailItem title="Properties" :noSeparator="true">
                <div v-if="asset && asset.properties.length>0">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                            <th class="p-2 font-weight-bold">Name</th>
                            <th class="p-2 font-weight-bold">Fact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="prop in asset.properties">
                            <td class="p-2">{{prop.name}}</td>
                            <td class="p-2">{{prop.fact.Text}}</td>
                        </tr>
                      </tbody>
                    </table>
                </div>
                <div v-else>
                    <h5 class="text-muted">None</h5>
                </div>
            </DetailItem>
        </ExplorerCard>

        <ExplorerCard title="Asset Activities" icon-class="fas fa-list-alt">
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
                        <td>{{activity.method.args[1].method ? activity.method.args[1].method :
                            activity.method.method}}
                        </td>
                        <td>
                            <router-link
                                    :title="activity.hash"
                                    :to="{ name: 'transaction-from-chain', params: { blockhashornumber: asset.blockNumber, txhash: activity.hash}}">
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
                    Fetching asset, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound :module-id="assetid" module="Asset Asset" v-if="flag === 'FAILURE'"/>
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
        name: "Asset",
        props: ["assetid", "hideChainDetails"],
        components: {Blockie, NotFound, DetailItem, ExplorerCard, StatusBadge},
        data() {
            return {
                asset: null,
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
                await this.getAsset();
                await this.getAssetActivities();
            },
            async getAsset() {
                if (this.assetid !== null) {
                    try {
                        EventBus.emit('show');
                        let reply = await this.axios.get(`assetregistry/assets/${this.assetid}`);
                        this.asset = reply.data;
                        if (this.asset) {
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
            async getAssetActivities() {
                if (this.asset) {
                    try {
                        let reply = await this.axios.get(`assetregistry/assets/${this.assetid}/activities`);
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
                return formatters.did(did);
            }
        }
    }
</script>

<style scoped>

</style>
