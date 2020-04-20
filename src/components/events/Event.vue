<template>
    <div class="row" v-if="show">
        <div class="col-12">
            <div class="card">
                <div class="card-header row m-b-0 p-b-0">
                    <div class="card-header-title">
                        <h5>Event <span class="fit">{{eventid}}</span></h5>
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
                            <router-link :to="{name: 'block', params: {number: event.blockNumber}}">{{event.blockNumber}}</router-link>
                        </div>
                    </dl>
                    <hr style="height: 1px"/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Referenced Extrinsic</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{event.extrinsicid}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Event Index</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{event.index}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Event Name</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{event.meta.name}}</dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Description</dt>
                        </div>
                        <div class="col-sm-10 text-sm-left">
                            <dd class="mb-1">{{event.meta.documentation.join(' ')}}</dd>
                        </div>
                    </dl>
                    <hr/>
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
                                            <vue-json-pretty :data="event.event.data[i-1]" :path="'res'">
                                            </vue-json-pretty>
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
                    <h4 class="card-title text-muted">No such event</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";
    import VueJsonPretty from 'vue-json-pretty';

    export default {
        name: "Lease",
        props: ["eventid"],
        components: {VueJsonPretty},
        data() {
            return {
                event: null,
                show: false
            };
        },
        mounted() {
            this.getEvent();
        },
        methods: {
            async getEvent() {
                try {
                    EventBus.$emit('show');
                    let reply      = await this.$http.get(`/events/${this.eventid}`);
                    this.event = reply.data;
                    if(this.event) {
                        this.show = true;
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