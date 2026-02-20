<template>
  <div class="row" v-if="flag === 'SUCCESS'">
    <div class="col-12">
      <ExplorerCard icon-class="fas fa-file-signature" body-class="m-t-0">
        <template #title>
          <h5 class="">
            <i class="fas fa fa-check-circle text-success" v-if="success"/>
            <i class="fas fa fa-exclamation-circle text-danger" v-else/>
            <span class="ml-2">Transaction <span class="font-weight-normal word-break">{{hash}}</span></span>
          </h5>
        </template>

        <DetailsList :items="transactionDetails">
          <template #block="{ item }">
            <router-link :to="{name: 'block', params: {number: item.value}}">{{item.value}}</router-link>
          </template>
          <template #status="{ item }">
            <StatusBadge :success="item.value" />
          </template>
          <template #address="{ item }">
            <router-link :to="{name: 'view-account',params: { address: item.value }}">
              <div class="float-left mr-2">
                <Blockie :address="item.value" class="mm-5-0-5-0"/>
              </div>
              <div class="float-left adjust-40">
                <span :title="item.value" class="align-middle word-break">{{ item.value }}</span>
              </div>
            </router-link>
          </template>
          <template #parameters="{ item }">
            <vue-json-pretty :data="item.value" :path="'res'">
            </vue-json-pretty>
          </template>
        </DetailsList>
      </ExplorerCard>
    </div>

    <div class="col-12">
      <EventsTable :events="transaction.events" />
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
      <ExplorerCard noHeader>
        <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
          Searching transaction, please wait <img class="ml-2" alt="" src="../../assets/images/ajax-loader.gif">
        </h4>
        <NotFound module="Transaction" :module-id="hash" v-if="flag === 'FAILURE'"/>
      </ExplorerCard>
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
import Blockie from "../common/Blockie.vue";
import NotFound from "../common/NotFound.vue";
import DetailsList from "../common/DetailsList.vue";
import EventsTable from "../common/EventsTable.vue";
import ExplorerCard from "../common/ExplorerCard.vue";
import StatusBadge from "../common/StatusBadge.vue";
import { formatters } from "@/utils/formatters";

export default {
  name: "Transaction",
  props: ["hash"],
  components: {ExplorerCard, Audit, Lease, VueJsonPretty, Blockie, Identity, NotFound, Process, DetailsList, EventsTable, StatusBadge},
  watch: {
    "hash": async function(nv, ov) {
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
  computed: {
    transactionDetails() {
      if (!this.transaction) {
        return [];
      }
      return [
        { label: 'Block', value: this.transaction.blockNumber, slotName: 'block' },
        { label: 'Timestamp', value: formatters.timestamp(this.transaction.timestamp.toString()) },
        { label: 'Transaction Index', value: this.transaction.index },
        { label: 'Transaction Hash', value: this.transaction.hash },
        { label: 'Status', value: this.success, slotName: 'status' },
        { label: 'Module', value: this.transaction.method.section },
        { label: 'Call', value: this.transaction.method.method },
        { label: 'Description', value: this.transaction.method.docs.join(' ') },
        { label: 'Address', value: this.transaction.signer.Id ? this.transaction.signer.Id : this.transaction.signer, slotName: 'address' },
        { label: 'Nonce', value: this.transaction.nonce },
        { label: 'Signature', value: this.transaction.signature },
        { label: 'Parameters', value: this.transaction.method.args, slotName: 'parameters' }
      ];
    }
  },
  mounted() {
    this.getTransaction();
  },
  methods: {
    async getTransaction() {
      try {
        EventBus.emit('show');
        let reply         = await this.axios.get(`/transactions/${this.hash}`);
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
    },
  }
}
</script>

<style scoped>

</style>