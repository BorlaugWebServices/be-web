<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="col-md-6 card-title">
                        <h5>Inherent <span class="fit">{{inherentid}}</span></h5>
                    </div>
                    <div class="col-md-6 text-right">
                        <h3><i class="fas fa-file-alt card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body mg-b-5">
                    <DetailRow label="Block">
                        <router-link :to="{name: 'block', params: {number: extrinsic.blockNumber}}">{{extrinsic.blockNumber}}</router-link>
                    </DetailRow>
                    <DetailRow label="Timestamp">
                        {{ formatters.timestamp(extrinsic.timestamp.toString()) }}
                    </DetailRow>
                    <DetailRow label="Extrinsic Index">
                        {{extrinsic.index}}
                    </DetailRow>
                    <DetailRow label="Module">
                        {{extrinsic.method.section}}
                    </DetailRow>
                    <DetailRow label="Call">
                        {{extrinsic.method.method}}
                    </DetailRow>
                    <DetailRow label="Description">
                        {{extrinsic.method.documentation.join(' ')}}
                    </DetailRow>
                    <DetailRow label="Parameters:" :with-hr="false">
                        <vue-json-pretty :data="extrinsic.method.args" :path="'res'">
                        </vue-json-pretty>
                    </DetailRow>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                        Fetching inherent, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound module="Inherent" :module-id="inherentid" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';
    import NotFound from "../common/NotFound.vue";
    import DetailRow from "../common/DetailRow.vue";
    import { formatters } from "@/utils/formatters";

    export default {
        name: "Inherent",
        props: ["inherentid"],
        components: {VueJsonPretty, NotFound, DetailRow},
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
