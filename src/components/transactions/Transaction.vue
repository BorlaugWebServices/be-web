<template>
    <div class="row" v-if="show">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="card-header-title">
                        <h5>Transaction <span class="fit">{{hash}}</span></h5>
                    </div>
                    <div class="card-header-icon">
                        <h3><i class="fas fa-file-signature card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body m-t-0 p-0">
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Block</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <router-link :to="{name: 'block', params: {number: transaction.blockNumber}}">{{transaction.blockNumber}}</router-link>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Timestamp</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.timestamp.toString() | timestamp}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Transaction Index</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.index}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Transaction Hash</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.hash}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Module</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.method.section}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Call</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.method.method}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Description</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.method.documentation.join(' ')}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Address</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">
                                <Blockie :address="transaction.signer" class="mm-5-0-5-0"/>
                                <span :title="transaction.signer" class="m-l-5 align-middle">{{ transaction.signer }}</span>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Nonce</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.nonce}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Signature</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{transaction.signature}}</dd>
                        </div>
                    </dl>
                    <hr/>
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
                    <div class="card-header-title">
                        <h5>Triggered Events</h5>
                    </div>
                    <div class="card-header-icon">
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
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-muted">No such transaction</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';
    import Lease from "../objects/AssetRegistry/Lease";
    import Blockie from "../common/Blockie";
    import _ from "lodash";

    export default {
        name: "Transaction",
        props: ["hash"],
        components: {Lease, VueJsonPretty, Blockie},
        data() {
            return {
                transaction: null,
                leaseid: null,
                show: false
            };
        },
        mounted() {
            this.getTransaction();
        },
        methods: {
            async getTransaction() {
                try {
                    EventBus.$emit('show');
                    let reply        = await this.$http.get(`/transactions/${this.hash}`);
                    this.transaction = reply.data;
                    if(this.transaction) {
                        this.show = true;
                        if(this.transaction.events.length > 0) {
                            let events = _.filter(this.transaction.events, (ev) => {
                                return ev.meta.name === 'LeaseCreated'
                            });
                            if(events.length > 0) {
                                this.leaseid = events[0].event.data[0];
                            }
                        }
                        console.log(this.leaseid);
                    }
                } catch(e) {

                } finally {
                    EventBus.$emit('hide');
                }
            }
        }
    }
</script>

<style scoped>

</style>