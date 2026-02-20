<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <ExplorerCard :title="'Event ' + eventid" icon-class="fas fa-file-alt">
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
                    {{event.meta.documentation?.join(' ')}}
                </DetailItem>
                <dl class="row m-b-10">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Parameters:</dt>
                    </div>
                    <div class="col-sm-10 text-sm-left">
                        <dd class="mb-1">
                          <table class="table table-bordered">
                            <tr v-for="(argName, index) in event.meta.args" :key="index">
                              <td>{{ argName }}</td>

                              <td>
                                <template v-if="argName === 'AccountId'">
                                  <AccountLink :address="event.event.data[index]" />
                                </template>

                                <template v-else-if="argName === 'GroupId'">
                                  <router-link :to="{ name: 'group', params: { groupid: event.event.data[index] } }">
                                    {{ event.event.data[index] }}
                                  </router-link>
                                </template>

                                <template v-else>
                                  <vue-json-pretty :data="event.event.data[index]" path="res" />
                                </template>
                              </td>
                            </tr>
                          </table>
                        </dd>
                    </div>
                </dl>
            </ExplorerCard>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <ExplorerCard>
                <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                    Fetching event, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound :module-id="eventid" module="Event" v-if="flag === 'FAILURE'"/>
            </ExplorerCard>
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
    import ExplorerCard from "@/components/common/ExplorerCard.vue";

    export default {
        name: "Event",
        props: ["eventid"],

        components: {VueJsonPretty, NotFound, Blockie, DetailItem, AccountLink, ExplorerCard},
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
