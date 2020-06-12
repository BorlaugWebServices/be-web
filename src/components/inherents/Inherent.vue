<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="card-header-title">
                        <h5>Inherent <span class="fit">{{inherentid}}</span></h5>
                    </div>
                    <div class="card-header-icon">
                        <h3><i class="fas fa-file-alt card-title text-orange"/></h3>
                    </div>
                </div>

                <div class="card-body mg-b-5">
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Block</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <router-link :to="{name: 'block', params: {number: extrinsic.blockNumber}}">{{extrinsic.blockNumber}}</router-link>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Timestamp</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{extrinsic.timestamp.toString() | timestamp}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Extrinsic Index</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{extrinsic.index}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Module</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{extrinsic.method.section}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Call</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{extrinsic.method.method}}</dd>
                        </div>
                    </dl>
                    <hr style="height: 1px"/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Description</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{extrinsic.method.documentation.join(' ')}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row m-b-10">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Parameters:</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">
                                <vue-json-pretty :data="extrinsic.method.args" :path="'res'">
                                </vue-json-pretty>
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
                        Fetching inherent, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                    </h4>
                    <h4 class="card-title text-muted" v-if="flag === 'FAILURE'">
                        Inherent "{{inherentid}}" not found
                    </h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';

    export default {
        name: "Inherent",
        props: ["inherentid"],
        components: {VueJsonPretty},
        data() {
            return {
                extrinsic: null,
                flag: 'SEARCHING'
            };
        },
        mounted() {
            this.getExtrinsic();
        },
        methods: {
            async getExtrinsic() {
                try {
                    EventBus.$emit('show');
                    let reply      = await this.$http.get(`/inherents/${this.inherentid}`);
                    this.extrinsic = reply.data;
                    if(this.extrinsic) {
                        this.flag = 'SUCCESS';
                    } else{
                        this.flag = 'FAILURE';
                    }
                } catch(e) {
                    this.flag = 'FAILURE';
                } finally {
                    EventBus.$emit('hide');
                }

            }
        }
    }
</script>

<style scoped>

</style>