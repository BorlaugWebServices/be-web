<template>
    <div v-if="flag === 'SUCCESS'">
        <ExplorerCard title="Audit" icon-class="fas fa-list-alt" cardClass="mb-4">
            <DetailItem title="Audit Id">
                {{audit.id}}
            </DetailItem>
            <template v-if="show">
                <DetailItem title="Block Number">
                    <router-link :to="{ name : 'block', params: {number: audit.blockNumber}}">{{audit.blockNumber}}</router-link>
                </DetailItem>
                <DetailItem title="Block Hash">
                    <router-link :to="{ name : 'block', params: {number: audit.blockNumber}}">{{audit.blockHash}}</router-link>
                </DetailItem>
                <DetailItem title="Transaction Hash">
                    <router-link :to="{ name : 'transaction-from-chain', params: {blockhash: audit.blockHash, txhash: audit.extrinsicHash}}">{{audit.extrinsicHash}}</router-link>
                </DetailItem>
            </template>
            <DetailItem title="Audit Creator">
                <router-link :to="{name: 'view-account',params: { address: audit.audit_creator }}">
                    <Blockie :address="audit.audit_creator" class="mm-5-0-5-0"/>
                    <span :title="audit.audit_creator" class="m-l-5 align-middle">{{ audit.audit_creator }}</span>
                </router-link>
            </DetailItem>
            <DetailItem title="Auditor">
                <router-link :to="{name: 'view-account',params: { address: audit.auditor }}">
                    <Blockie :address="audit.auditor" class="mm-5-0-5-0"/>
                    <span :title="audit.auditor" class="m-l-5 align-middle">{{ audit.auditor }}</span>
                </router-link>
            </DetailItem>
            <DetailItem title="Created at" :noSeparator="true">
                {{ formatters.from_ms(audit.timestamp) }}
            </DetailItem>
        </ExplorerCard>

        <ExplorerCard title="Audit Activities" icon-class="fas fa-list-alt">
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
                            <router-link :to="{ name: 'transaction-from-chain', params: { blockhashornumber: audit.blockNumber, txhash: activity.hash}}"
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
                    Fetching audit, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound module="Audit" :module-id="auditid" v-if="flag === 'FAILURE'"/>
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
        name: "Audit",
        props: ["auditid", "hideChainDetails"],
        components: {Blockie, NotFound, DetailItem, ExplorerCard, StatusBadge},
        data() {
            return {
                audit: null,
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
                await this.getAudit();
                await this.getAuditActivities();
            },
            async getAudit() {
                if(this.auditid !== null) {
                    try {
                        EventBus.emit('show');
                        let reply  = await this.axios.get(`/audits/${this.auditid}`);
                        this.audit = reply.data;
                        if(this.audit) {
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
            async getAuditActivities() {
                if(this.audit) {
                    try {
                        let reply       = await this.axios.get(`/audits/${this.auditid}/activities`);
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
            }
        }
    }
</script>

<style scoped>

</style>
