<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="col card-title adjust-500">
                        <h5 class="">
                            <i class="fas fa fa-check-circle text-success" v-if="success"/>
                            <i class="fas fa fa-exclamation-circle text-danger" v-else/>
                            <span class="ml-2">Transaction <span class="font-weight-normal word-break">{{txhash}}</span></span>
                        </h5>
                    </div>
                    <div class="col-auto text-right">
                        <h3><i class="fas fa-file-signature card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body m-t-0">
                    <DetailItem title="Block">
                        <router-link :to="{name: 'block', params: {number: transaction.blockNumber}}">{{transaction.blockNumber}}</router-link>
                    </DetailItem>
                    <DetailItem title="Timestamp">
                        <span v-if="transaction.timestamp">{{ formatters.timestamp(transaction.timestamp.toString()) }}</span>
                    </DetailItem>
                    <DetailItem title="Transaction Index">
                        {{transaction.index}}
                    </DetailItem>
                    <DetailItem title="Transaction Hash">
                        {{transaction.hash}}
                    </DetailItem>
                    <DetailItem title="Status">
                      <StatusBadge :success="success" />
                    </DetailItem>
                    <DetailItem title="Module">
                        {{transaction.method.section}}
                    </DetailItem>
                    <DetailItem title="Call">
                        {{transaction.method.method}}
                    </DetailItem>
                    <DetailItem title="Description">
                        {{transaction.method.docs?.join(' ')}}
                    </DetailItem>
                    <DetailItem title="Address">
                        <AccountLink :address="transaction.signer.Id ? transaction.signer.Id : transaction.signer"/>
                    </DetailItem>
                    <DetailItem title="Nonce">
                        {{transaction.nonce}}
                    </DetailItem>
                    <DetailItem title="Signature">
                        {{transaction.signature}}
                    </DetailItem>
                    <dl class="row m-b-10">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Parameters:</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">
                                <vue-json-pretty :data="transaction.method.args" :path="'res'">
                                </vue-json-pretty>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="col-md-6 card-title">
                        <h5>Triggered Events</h5>
                    </div>
                    <div class="col-md-6 text-right">
                        <h3><i class="fas fa-calendar-check card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body p-t-0 p-b-0 m-t-0">
                    <div class="table-responsive blocks p-0 m-b-0" v-if="transaction.events && transaction.events.length > 0">
                        <table class="table v-middle">
                            <thead>
                            <tr class="border-0">
                                <th class="border-0"></th>
                                <th class="border-0 font-weight-bold">Event ID</th>
                                <th class="border-0 font-weight-bold">Event</th>
                                <th class="border-0"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(ev, index) in transaction.events">
                                <td>
                                    <i class="fas fa-file-alt"></i>
                                </td>
                                <td class="block">
                                    <div class="d-flex no-block align-items-center">
                                        <router-link :to="{ name: 'event', params: {eventid: ev.id}}" class="hash">{{ ev.id }}</router-link>
                                    </div>
                                </td>
                                <td>
                                    {{ev.meta.name}}
                                </td>
                                <td class="text-right">
                                    <router-link :to="{ name: 'event', params: {eventid: ev.id}}" class="btn btn-sm btn-orange text-white">
                                        Details
                                    </router-link>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <h4 class="text-center text-muted p-25">No Events</h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12" v-if="transaction && transaction.method.section === 'assetRegistry' && transaction.method.method === 'newLease'">
            <Lease :leaseid="leaseid" :hide-chain-details="true"/>
        </div>
        <div class="col-12" v-if="transaction && transaction.method.section === 'identity' && ['registerDidFor','registerDid'].includes(transaction.method.method)">
            <Identity :did="did" :hide-chain-details="true"/>
        </div>
        <div class="col-12" v-if="transaction && transaction.method.section === 'audits' && transaction.method.method === 'createAudit'">
            <Audit :auditid="auditid" :hide-chain-details="true"/>
        </div>
        <div class="col-12" v-if="transaction && transaction.method.section === 'provenance' && transaction.method.method === 'createSequence'">
            <Process :processid="processid" :hide-chain-details="true"/>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                        Searching transaction, please wait <img class="ml-2" alt="" src="../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound module="Transaction" :module-id="txhash" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isMobile} from 'mobile-device-detect';
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';
    import Lease from "../objects/AssetRegistry/Lease.vue";
    import Identity from "../objects/Identity/Identity.vue";
    import Audit from "../objects/Audit/Audit.vue";
    import Process from "../objects/Provenance/Process.vue";
    import NotFound from "../common/NotFound.vue";
    import DetailItem from "../common/DetailItem.vue";
    import AccountLink from "../common/AccountLink.vue";
    import { formatters } from "@/utils/formatters";
    import StatusBadge from "@/components/common/StatusBadge.vue";

    export default {
        name: "TransactionFromChain",
        props: ["blockhashornumber", "txhash"],
        components: {StatusBadge, Audit, Lease, VueJsonPretty, Identity, NotFound, Process, DetailItem, AccountLink},
        watch: {
            "txhash": async function(nv, ov) {
                await this.getTransaction();
            }
        },
        data() {
            return {
                isMobile: isMobile,
                transaction: null,
                leaseid: null,
                did: null,
                auditid: null,
                processid: null,
                flag: 'SEARCHING',
                success: false,
                formatters: formatters
            };
        },
        mounted() {
            this.getTransaction();
        },
        methods: {
            async getTransaction() {
                try {
                    EventBus.emit('show');
                    let reply         = await this.axios.get(`/transactions/${this.txhash}`);
                    this.transaction  = reply.data;
                  this.success      = this.transaction.events.some(event => event.meta.name === "ExtrinsicSuccess");

                    if(this.transaction) {
                        this.flag = 'SUCCESS';
                      for (const event of this.transaction.events) {
                        switch (event.meta.name) {
                          case 'LeaseCreated':
                            this.leaseid = event.event.data[0];
                            break;
                          case 'Registered':
                            this.did = formatters.did(event.event.data[3].id);
                            break;
                          case 'AuditCreated':
                            this.auditid = event.event.data[2];
                            break;
                          case 'SequenceCreated':
                            this.processid = event.event.data[5];
                            break;
                          default:
                            // No action needed for other event types
                            break;
                        }
                      }
                    } else {
                        this.flag = 'FAILURE';
                    }
                } catch(e) {
                    console.error(e);
                    this.flag = 'FAILURE';
                } finally {
                    EventBus.emit('hide');
                }
            }
        }
    }
</script>

<style scoped>

</style>
