<template>
    <div class="row" v-if="flag === 'SUCCESS'">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="card-header-title">
                        <h5>Log <span class="fit">{{logid}}</span></h5>
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
                            <router-link :to="{name: 'block', params: {number: log.blockNumber}}">{{log.blockNumber}}</router-link>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Log Index</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{log.index}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Type</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{type}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Data</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">
                                <vue-json-pretty :data="log.log[type]" :path="'res'"></vue-json-pretty>
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
                        Fetching log, please wait <img class="ml-2" src="../../assets/images/ajax-loader.gif">
                    </h4>
                    <h4 class="card-title text-muted" v-if="flag === 'FAILURE'">
                        Log "{{logid}}" not found
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
        name: "Log",
        props: ["logid"],
        components: {VueJsonPretty},
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
                    EventBus.$emit('show');
                    let reply = await this.$http.get(`/logs/${this.logid}`);
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
                    EventBus.$emit('hide');
                }
            }
        }
    }
</script>

<style scoped>

</style>