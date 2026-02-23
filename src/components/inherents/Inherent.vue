<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <ExplorerCard :title="'Inherent ' + inherentid" icon-class="fas fa-file-alt">
                <DetailItem title="Block">
                    <router-link :to="{name: 'block', params: {number: extrinsic.blockNumber}}">{{extrinsic.blockNumber}}</router-link>
                </DetailItem>
                <DetailItem title="Timestamp">
                    {{ formatters.timestamp(extrinsic.timestamp?.toString()) }}
                </DetailItem>
                <DetailItem title="Extrinsic Index">
                    {{extrinsic.index}}
                </DetailItem>
                <DetailItem title="Module">
                    {{extrinsic.method.section}}
                </DetailItem>
                <DetailItem title="Call">
                    {{extrinsic.method.method}}
                </DetailItem>
                <DetailItem title="Description">
                    {{extrinsic.method.docs.join(' ')}}
                </DetailItem>
                <DetailItem title="Parameters:" :noSeparator="true">
                    <vue-json-pretty :data="extrinsic.method.args" :path="'res'">
                    </vue-json-pretty>
                </DetailItem>
            </ExplorerCard>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <ExplorerCard>
                <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                    Fetching inherent, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                </h4>
                <NotFound module="Inherent" :module-id="inherentid" v-if="flag === 'FAILURE'"/>
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
    import { formatters } from "@/utils/formatters";

    export default {
        name: "Inherent",
        props: ["inherentid"],
        components: {VueJsonPretty, NotFound, DetailItem, ExplorerCard},
        data() {
            return {
                extrinsic: null,
                flag: 'SEARCHING',
                formatters: formatters
            };
        },
        mounted() {
            this.getExtrinsic();
        },
        methods: {
            async getExtrinsic() {
                try {
                    EventBus.emit('show');
                    let reply      = await this.axios.get(`/inherents/${this.inherentid}`);
                    this.extrinsic = reply.data;
                    if(this.extrinsic) {
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
