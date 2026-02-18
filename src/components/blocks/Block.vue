<template>
  <div class="row" v-if="flag === 'SUCCESS'">
    <div class="col-12">
      <ExplorerCard :iconClass="'fa fa-cube'" cardClass="mb-4">
        <template #title>
          <h5>Block # <span class="fit">{{ block.number }}</span></h5>
        </template>

        <DetailItem title="Timestamp" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
          {{ formatters.timestamp(block.timestamp.toString()) }}
        </DetailItem>
        <DetailItem title="Hash" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
          {{ block.hash }}
        </DetailItem>
        <DetailItem title="Parent Hash" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
          <router-link :to="{name: 'block', params: {number: block.number - 1}}">{{ block.parentHash }}</router-link>
        </DetailItem>
        <DetailItem title="State Root" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
          {{ block.stateRoot }}
        </DetailItem>
        <DetailItem title="Extrinsics Root" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
          {{ block.extrinsicsRoot }}
        </DetailItem>
        <DetailItem title="Total Extrinsics" labelClass="col-sm-3 text-sm-right" valueClass="col-sm-9 text-sm-left">
          {{ block.transactions.length + block.inherents.length }}
        </DetailItem>
        <DetailItem title="Total Signed Extrinsics" labelClass="col-sm-3 text-sm-right"
                    valueClass="col-sm-9 text-sm-left" :noSeparator="true">
          {{ block.transactions.length }}
        </DetailItem>
      </ExplorerCard>
    </div>

    <div class="col-12">
      <ExplorerCard :noHeader="true" cardClass="mb-4">

        <ul class="nav nav-pills custom-pills" id="myTab" role="tablist">
          <li class="nav-item">
            <a aria-controls="transactions" aria-selected="true" class="nav-link active"
               data-toggle="tab" href="#transactions" id="transactions-tab" role="tab">
              <i class="fas fa-file-signature"/> Transaction
            </a>
          </li>
          <li class="nav-item">
            <a aria-controls="inherents" aria-selected="false" class="nav-link"
               data-toggle="tab" href="#inherents" id="inherents-tab" role="tab">
              <i class="fas fa-file-alt"/> Inherent
            </a>
          </li>
          <li class="nav-item">
            <a aria-controls="events" aria-selected="false" class="nav-link"
               data-toggle="tab" href="#events" id="events-tab" role="tab">
              <i class="fas fa-calendar-check"/> Events
            </a>
          </li>
          <li class="nav-item">
            <a aria-controls="logs" aria-selected="false" class="nav-link"
               data-toggle="tab" href="#logs" id="logs-tab" role="tab">
              <i class="fas fa-book"/> Logs
            </a>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div aria-labelledby="transactions-tab" class="tab-pane fade show active" id="transactions" role="tabpanel">
            <div class="table-responsive blocks" v-if="block.transactions.length > 0">
              <table class="table v-middle">
                <thead>
                <tr class="border-0">
                  <th class="border-0"></th>
                  <th class="border-0 font-weight-bold">Hash</th>
                  <th class="border-0 font-weight-bold">From</th>
                  <th class="border-0 font-weight-bold">Module</th>
                  <th class="border-0 font-weight-bold">Call</th>
                  <th class="border-0 font-weight-bold text-center">Status</th>
                  <th class="border-0"></th>
                </tr>
                </thead>
                <tbody>
                <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(tx, index) in block.transactions">
                  <td>
                    <i class="fas fa-file-signature"></i>
                  </td>
                  <td>
                    <div class="d-flex no-block align-items-center">
                      <router-link :title="tx.hash"
                                   :to="{ name: 'transaction-from-chain', params: { blockhashornumber: block.number, txhash: tx.hash}}"
                                   class="hash">{{ tx.hash }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <AccountLink :address="tx.signer.Id ? tx.signer.Id : tx.signer"/>
                  </td>
                  <td>
                    {{ tx.method.section }}
                  </td>
                  <td>
                    {{ tx.method.method }}
                  </td>
                  <td class="text-center">
                    <span class="badge rounded-pill bg-success font-weight-bold"
                          v-if="isTransactionSuccess(tx)">
                        <i class="fa fa-check-circle"/> SUCCESS
                    </span>
                    <span class="badge rounded-pill bg-danger font-weight-bold" v-else>
                        <i class="fas fa-exclamation-circle"></i> FAILED
                    </span>
                  </td>
                  <td class="text-right">
                    <router-link
                        :to="{ name: 'transaction-from-chain', params: { blockhashornumber: block.number, txhash: tx.hash}}"
                        class="btn btn-sm btn-orange text-white">
                      Details
                    </router-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <h4 class="text-center text-muted p-25">No Transactions</h4>
            </div>
          </div>
          <div aria-labelledby="inherents-tab" class="tab-pane fade" id="inherents" role="tabpanel">
            <div class="table-responsive blocks" v-if="block.inherents.length > 0">
              <table class="table v-middle">
                <thead>
                <tr class="border-0">
                  <th class="border-0"></th>
                  <th class="border-0 font-weight-bold">Inherent ID</th>
                  <th class="border-0 font-weight-bold">Module</th>
                  <th class="border-0 font-weight-bold">Call</th>
                  <th class="border-0 font-weight-bold text-center">Signed</th>
                  <th class="border-0"></th>
                </tr>
                </thead>
                <tbody>
                <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(inh, index) in block.inherents">
                  <td>
                    <i class="fas fa-file-alt"></i>
                  </td>
                  <td>
                    <div class="d-flex no-block align-items-center">
                      <router-link :to="{ name: 'inherent', params: {inherentid: inh.id}}" class="hash">{{
                          inh.id
                        }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    {{ inh.method?.section }}
                  </td>
                  <td>
                    {{ inh.method?.method }}
                  </td>
                  <td class="text-center">
                    <i class="far fa-check-circle text-success" v-if="inh.isSigned"/>
                    <i class="far fa-times-circle text-danger" v-if="!inh.isSigned"/>
                  </td>
                  <td class="text-right">
                    <router-link :to="{ name: 'inherent', params: {inherentid: inh.id}}"
                                 class="btn btn-sm btn-orange text-white">
                      Details
                    </router-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <h4 class="text-center text-muted p-25">No Inherents</h4>
            </div>
          </div>
          <div aria-labelledby="events-tab" class="tab-pane fade" id="events" role="tabpanel">
            <div class="table-responsive blocks" v-if="block.events.length > 0">
              <table class="table v-middle">
                <thead>
                <tr class="border-0">
                  <th class="border-0"></th>
                  <th class="border-0 font-weight-bold">Event ID</th>
                  <th class="border-0 font-weight-bold">Referenced Txn</th>
                  <th class="border-0 font-weight-bold">Event</th>
                  <th class="border-0"></th>
                </tr>
                </thead>
                <tbody>
                <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(ev, index) in block.events">
                  <td>
                    <i class="fas fa-file-alt"></i>
                  </td>
                  <td>
                    <div class="d-flex no-block align-items-center">
                      <router-link :to="{ name: 'event', params: {eventid: ev.id}}" class="hash">{{
                          ev.id
                        }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    {{ ev.extrinsicid }}
                  </td>
                  <td>
                    {{ ev.meta?.name }}
                  </td>
                  <td class="text-right">
                    <router-link :to="{ name: 'event', params: {eventid: ev.id}}"
                                 class="btn btn-sm btn-orange text-white">
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
          <div aria-labelledby="logs-tab" class="tab-pane fade" id="logs" role="tabpanel">
            <div class="table-responsive blocks" v-if="block.logs.length > 0">
              <table class="table v-middle">
                <thead>
                <tr class="border-0">
                  <th class="border-0"></th>
                  <th class="border-0 font-weight-bold">Log #</th>
                  <th class="border-0 font-weight-bold">Type</th>
                  <th class="border-0"></th>
                </tr>
                </thead>
                <tbody>
                <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(log, index) in block.logs">
                  <td>
                    <i class="fas fa-book"></i>
                  </td>
                  <td>
                    <div class="d-flex no-block align-items-center">
                      <router-link :to="{ name: 'log', params: { logid: log.id}}">{{
                          block.number + '-' + index
                        }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    {{ getLogType(log.log) }}
                  </td>
                  <td class="text-right">
                    <router-link  :to="{ name: 'log', params: { logid: log.id}}" class="btn btn-sm btn-orange text-white">
                      Details
                    </router-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <h4 class="text-center text-muted p-25">No Logs</h4>
            </div>
          </div>
        </div>
      </ExplorerCard>
    </div>
  </div>
  <div class="row" v-else>
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
            Fetching block, please wait <img class="ml-2" alt="" src="../../assets/images/ajax-loader.gif">
          </h4>
          <NotFound module="Block" :module-id="number" v-if="flag === 'FAILURE'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../../event-bus";
import NotFound from "../common/NotFound.vue";
import DetailItem from "../common/DetailItem.vue";
import AccountLink from "../common/AccountLink.vue";
import {formatters} from "@/utils/formatters";
import ExplorerCard from "@/components/common/ExplorerCard.vue";

export default {
  name: "Block",
  props: ["number"],
  components: {NotFound, DetailItem, AccountLink, ExplorerCard},
  data() {
    return {
      block: {},
      flag: 'SEARCHING',
      formatters: formatters
    };
  },
  watch: {
    number: function (n, o) {
      this.getBlock();
    }
  },
  mounted() {
    this.getBlock();
  },
  methods: {
    async getBlock() {
      try {
        EventBus.emit('show');
        let reply = await this.axios.get(`/blocks/${this.number}`);
        this.block = reply.data;
        if (this.block) {
          this.flag = 'SUCCESS';
        } else {
          this.flag = 'FAILURE';
        }
      } catch (e) {
        this.flag = 'FAILURE';
      } finally {
        EventBus.emit('hide');
      }
    },
    getLogType(log) {
      return Object.keys(log)[0];
    },
    isTransactionSuccess(tx) {
      let successEvent = this.block.events.filter((event) => {
        return event.extrinsicid === tx.id && event.meta.name === "ExtrinsicSuccess";
      });

      return successEvent.length > 0;
    }
  }
}
</script>

<style scoped>
.nav-pills.custom-pills .nav-link.active {
  color: #FB8C00;
  opacity: 1;
  background-color: transparent;
  border-bottom: 2px solid #FB8C00;
}
</style>
