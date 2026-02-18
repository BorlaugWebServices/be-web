<template>
  <div class="row">
    <div class="col-12">
      <ExplorerCard icon-class="fas fa-users" body-class="m-t-0 p-0">
        <template #title>
          <h5 v-if="show">Showing {{accounts.length}} of {{total}} accounts</h5>
        </template>

        <div class="table-responsive blocks">
          <table class="table v-middle">
            <thead>
            <tr class="border-0">
              <th class="border-0">#</th>
              <th class="border-0 font-weight-bold">Address</th>
              <th class="border-0 font-weight-bold">No. of Transactions</th>
              <th class="border-0 text-right font-weight-bold">Balance</th>
              <th class="border-0"></th>
            </tr>
            </thead>
            <tbody>
            <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(account, index) in accounts">
              <td>{{index+1}}</td>
              <td>
                <div class="mb-1">
                  <div class="float-left mr-2" :class="isMobile?'pt-2':''">
                    <Blockie :address="account.signer" class="mm-5-0-5-0"/>
                  </div>
                  <div class="float-left adjust-40">
                    <span :title="account.signer" class="align-middle word-break">{{ account.signer }}</span>
                  </div>
                </div>
              </td>
              <td>{{account.count}}</td>
              <td class="text-right">
                <b>{{ formatters.formatGRAM(account.balance) }}</b>
              </td>
              <td class="text-right">
                <router-link
                    :to="{name: 'view-account', params: {address: account.signer}}"
                    class="btn btn-sm btn-orange text-white">
                  Details
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </ExplorerCard>
    </div>
    <div class="col-lg-12">
      <div class="text-right">
        <nav aria-label="Page navigation example">
          <paginate
              :click-handler="pageHandler"
              :container-class="'pagination justify-content-end'"
              :margin-pages="2"
              :page-count="pageCount"
              :page-range="1"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :no-li-surround="false"
              :page-class="'page-item'"
              :page-link-class="'page-link'"
              :prev-class="'page-item'"
              :prev-link-class="'page-link'"
              :next-class="'page-item'"
              :next-link-class="'page-link'"
              :break-view-link-class="'break-view-link'">
          </paginate>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../../event-bus";
import Paginate from 'vuejs-paginate-next';
import Age from "../common/Age.vue";
import {isMobile} from "mobile-device-detect";
import Blockie from "../common/Blockie.vue";
import GetAccountBalance from "../common/GetAccountBalance.vue";
import ExplorerCard from "../common/ExplorerCard.vue";
import { formatters } from "@/utils/formatters";

export default {
  name: "Accounts",
  props: ['address'],
  components: {ExplorerCard, GetAccountBalance, Paginate, Age, Blockie},
  data() {
    return {
      isMobile: isMobile,
      accounts: [],
      total: 0,
      pageCount: 1,
      show: false,
      perPage: localStorage.getItem("perPage") || 10,
      formatters: formatters
    };
  },
  mounted() {
    this.getSigners(1);
  },
  methods: {
    async getSigners(page) {
      try {
        EventBus.emit('show');
        let reply = await this.axios.get(`/accounts`, {
          params: {
            page: page - 1,
            perPage: this.perPage
          }
        });
        this.accounts = reply.data.slice;
        this.total = reply.data.total;
        this.accounts = this.accounts.map(a=> {
          a.signer = JSON.parse(a.signer).Id;
          return a;
        })
        this.setPageCount();
      } catch (e) {

      } finally {
        this.show = true;
        EventBus.emit('hide');
      }
    },
    pageHandler(pageNum) {
      this.getSigners(pageNum);
    },
    setPageCount() {
      this.pageCount = this.total <= 10 ? 1 : Math.ceil(this.total / 10);
    }
  }
}
</script>

<style scoped>
.block {
  width: 200px;
  min-width: 200px;
}

.blocks table td {
  padding: 1em 1em !important;
  vertical-align: top !important;
}

.blocks table th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6 !important;
}
</style>