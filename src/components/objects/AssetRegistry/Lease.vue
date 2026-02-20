<template>
    <div v-if="flag === 'SUCCESS'">
        <ExplorerCard title="Lease" icon-class="fas fa-file-signature" cardClass="mb-4">
            <DetailItem title="Lease Id">
                {{lease.id}}
            </DetailItem>
            <DetailItem title="Contract Number">
                {{ formatters.hexToString(lease.contract_number) }}
            </DetailItem>
            <template v-if="show">
                <DetailItem title="Block Number">
                    <router-link :to="{ name : 'block', params: {number: lease.blockNumber}}">
                        {{lease.blockNumber}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Block Hash">
                    <router-link :to="{ name : 'block', params: {number: lease.blockNumber}}">
                        {{lease.blockHash}}
                    </router-link>
                </DetailItem>
                <DetailItem title="Transaction Hash">
                    <router-link
                            :to="{ name : 'transaction-from-chain', params: {blockhash: lease.blockHash, txhash: lease.extrinsicHash}}">
                        {{lease.extrinsicHash}}
                    </router-link>
                </DetailItem>
            </template>
            <DetailItem title="Lessor">
                <router-link :to="{name: 'identity', params : { did: getDid(lease.lessor) }}">
                    <Blockie :address="lease.lessor" class="mm-5-0-5-0 float-left"/>
                    <dd class="ml-2 float-left">{{ formatters.did(lease.lessor) }}</dd>
                </router-link>
            </DetailItem>
            <DetailItem title="Lessee">
                <router-link :to="{name: 'identity', params : { did: getDid(lease.lessee) }}">
                    <Blockie :address="lease.lessee" class="mm-5-0-5-0 float-left"/>
                    <dd class="ml-2 float-left">{{ formatters.did(lease.lessee) }}</dd>
                </router-link>
            </DetailItem>
            <DetailItem title="Effective From">
                {{ formatters.date(lease.effective_ts) }}
            </DetailItem>
            <DetailItem title="Effective To">
                {{ formatters.date(lease.expiry_ts) }}
            </DetailItem>
            <DetailItem title="Allocations" v-if="lease && lease.allocations.length>0" :noSeparator="true">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                        <th class="p-2 font-weight-bold">Asset</th>
                        <th class="p-2 font-weight-bold">Allocated Shares</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prop in lease.allocations">
                        <td class="p-2">
                            <router-link :to="{name: 'asset',params: { assetid: prop.asset_id }}">
                                {{prop.asset_id}}
                            </router-link>
                        </td>
                        <td class="p-2">{{prop.allocated_shares}}</td>
                    </tr>
                  </tbody>
                </table>
            </DetailItem>
        </ExplorerCard>

        <ExplorerCard title="Lease Activities" icon-class="fas fa-file-signature">
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
                    Fetching lease, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound :module-id="leaseid" module="Lease" v-if="flag === 'FAILURE'"/>
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
        name: "Lease",
        props: ["leaseid", "hideChainDetails"],
        components: {Blockie, NotFound, DetailItem, ExplorerCard, StatusBadge},
        data() {
            return {
                lease: null,
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
                return formatters.did(did);
            }
        }
    }
</script>

<style scoped>

</style>
