<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <ExplorerCard :title="'Log ' + logid" icon-class="fas fa-file-alt">
                <DetailItem title="Block">
                    <router-link :to="{name: 'block', params: {number: log.blockNumber}}">{{log.blockNumber}}</router-link>
                </DetailItem>
                <DetailItem title="Log Index">
                    {{log.index}}
                </DetailItem>
                <DetailItem title="Type">
                    {{type}}
                </DetailItem>
                <DetailItem title="Data" :noSeparator="true">
                    <vue-json-pretty :data="log.log[type]" :path="'res'"></vue-json-pretty>
                </DetailItem>
            </ExplorerCard>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <ExplorerCard>
                <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                    Fetching log, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound module="Log" :module-id="logid" v-if="flag === 'FAILURE'"/>
            </ExplorerCard>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';
    import NotFound from "../common/NotFound.vue";
    import DetailItem from "../common/DetailItem.vue";
    import ExplorerCard from "@/components/common/ExplorerCard.vue";

    export default {
        name: "Log",
        props: ["logid"],
        components: {VueJsonPretty, NotFound, DetailItem, ExplorerCard},
        data() {
            return {
                log: null,
                type: null,
                flag: 'SEARCHING'
            };
        },
        mounted() {
            this.getLog();
        },
        methods: {
            async getLog() {
                try {
                    EventBus.emit('show');
                    let reply = await this.axios.get(`/logs/${this.logid}`);
                    this.log  = reply.data;
                    if(this.log) {
                        this.type = Object.keys(this.log.log)[0];
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
        }
    }
</script>

<style scoped>

</style>
