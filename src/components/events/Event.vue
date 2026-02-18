<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="col-md-6 card-title">
                        <h5>Event <span class="fit">{{eventid}}</span></h5>
                    </div>
                    <div class="col-md-6 text-right">
                        <h3><i class="fas fa-file-alt card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body mg-b-5">
                    <DetailItem title="Block">
                        <router-link :to="{name: 'block', params: {number: event.blockNumber}}">
                            {{event.blockNumber}}
                        </router-link>
                    </DetailItem>
                    <DetailItem title="Referenced Extrinsic">
                        {{event.extrinsicid}}
                    </DetailItem>
                    <DetailItem title="Event Index">
                        {{event.index}}
                    </DetailItem>
                    <DetailItem title="Event Name">
                        {{event.meta.name}}
                    </DetailItem>
                    <DetailItem title="Description">
                        {{event.meta.docs.join(' ')}}
                    </DetailItem>
                    <dl class="row m-b-10">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Parameters:</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">
                                <table class="table table-bordered">
                                    <tr v-for="i in event.meta.args.length">
                                        <td>{{event.meta.args[i-1]}}</td>
                                        <td>
                                            <div v-if="event.meta.args[i-1] === 'AccountId'">
                                                <AccountLink :address="event.event.data[i-1]"/>
                                            </div>
                                            <div v-else-if="event.meta.args[i-1] === 'GroupId'">
                                                <router-link :to="{name: 'group', params: {groupid: event.event.data[i-1]}}">
                                                    {{event.event.data[i-1]}}
                                                </router-link>
                                            </div>
                                            <div v-else>
                                                <vue-json-pretty :data="event.event.data[i-1]" :path="'res'">
                                                </vue-json-pretty>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                        Fetching event, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound :module-id="eventid" module="Event" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';
    import NotFound from "../common/NotFound.vue";
    import Blockie from "../common/Blockie.vue";
    import DetailItem from "../common/DetailItem.vue";
    import AccountLink from "../common/AccountLink.vue";

    export default {
        name: "Lease",
        props: ["eventid"],

        components: {VueJsonPretty, NotFound, Blockie, DetailItem, AccountLink},
        data() {
            return {
                event: null,
                flag: 'SEARCHING'
            };
        },
        mounted() {
            this.getEvent();
        },
        methods: {
            async getEvent() {
                try {
                    EventBus.emit('show');
                    let reply = await this.axios.get(`/events/${this.eventid}`);
                    this.event = reply.data;
                    if (this.event) {
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
        }
    }
</script>

<style scoped>

</style>
