<template>
    <div v-if="flag === 'SUCCESS'">
        <div class="card">
            <div class="card-header row m-b-0 p-b-0">
                <div class="card-header-title">
                    <h4>Identifier</h4>
                </div>
                <div class="card-header-icon">
                    <h3><i class="fas fa-id-card card-title text-orange"/></h3>
                </div>
            </div>

            <div class="card-body mg-b-20 p-t-0">
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>DID</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="show">
                        <Blockie :address="identity.did" class="mm-5-0-5-0 float-left"/>
                        <dd class="ml-2 float-left">{{identity.did | did}}</dd>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-else>
                        <router-link :to="{name: 'identity', params : { did: did }}">
                            <Blockie :address="identity.did" class="mm-5-0-5-0 float-left"/>
                            <dd class="ml-2 float-left">{{identity.did | did}}</dd>
                        </router-link>
                    </div>
                </dl>
                <hr/>
                <template v-if="show">
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Block Number</dt>
                        </div>
                        <div class="col-sm-9 text-sm-left">
                            <dd class="mb-1">
                                <router-link :to="{ name : 'block', params: {number: identity.blockNumber}}">{{identity.blockNumber}}</router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Block Hash</dt>
                        </div>
                        <div class="col-sm-9 text-sm-left">
                            <dd class="mb-1">
                                <router-link :to="{ name : 'block', params: {number: identity.blockNumber}}">{{identity.blockHash}}</router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                    <dl class="row mb-0">
                        <div class="col-sm-2 text-sm-right">
                            <dt>Transaction Hash</dt>
                        </div>
                        <div class="col-sm-9 text-sm-left">
                            <dd class="mb-1">
                                <router-link :to="{ name : 'transaction-from-chain', params: {blockhash: identity.blockHash, txhash: identity.extrinsicHash}}">{{identity.extrinsicHash}}</router-link>
                            </dd>
                        </div>
                    </dl>
                    <hr/>
                </template>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Subject</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            {{identity.subject}}
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Controller</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            {{identity.controller}}
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Properties</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left">
                        <dd class="mb-1">
                            <table class="table table-bordered">
                                <tr>
                                    <th class="p-2 font-bold">Name</th>
                                    <th class="p-2 font-bold">Fact</th>
                                </tr>
                                <tr v-for="prop in identity.properties">
                                    <td class="p-2">{{prop.name}}</td>
                                    <td class="p-2" v-if="typeof prop.fact === 'object'">{{prop.fact | formatDate}}</td>
                                    <td class="p-2" v-else-if="isUrl(prop.fact)">
                                        <a target="_blank" v-bind:href="prop.fact">View Details</a>
                                    </td>
                                    <td class="p-2" v-else>{{prop.fact}}</td>
                                </tr>
                            </table>
                        </dd>
                    </div>
                </dl>
                <hr/>
                <dl class="row mb-0" v-if="identity">
                    <div class="col-sm-2 text-sm-right">
                        <dt>Claims</dt>
                    </div>
                    <div class="col-sm-9 text-sm-left" v-if="identity.claims.length>0">
                        <div class="card border mb-2">
                            <div class="card-body p-2" >
                                <dt>Description :</dt>
                                <dd>{{identity.claims[claimIndex].description}}</dd>

                                <dt>Statments :</dt>
                                <dd>
                                    <table class="table table-bordered">
                                        <tr>
                                            <th class="p-2 font-bold">Name</th>
                                            <th class="p-2 font-bold">Fact</th>
                                        </tr>
                                        <tr v-for="st    in identity.claims[claimIndex].statements">
                                            <td class="p-2">{{st.name}}</td>
                                            <td class="p-2"  v-if="typeof st.fact === 'object'">{{st.fact | formatDate}}</td>
                                            <td class="p-2" v-else-if="isUrl(st.fact)">
                                                <a target="_blank" v-bind:href="st.fact">View Details</a>
                                            </td>
                                            <td class="p-2" v-else>{{st.fact}}</td>
                                        </tr>
                                    </table>
                                </dd>

                                <dt class="m-b-5">Created By :</dt>
                                <dd class="mb-3">
                                    <router-link :to="{name: 'identity', params : { did: $options.filters.did(identity.claims[claimIndex].created_by.id) }}">
                                        <Blockie :address="identity.claims[claimIndex].created_by.id"/>
                                        {{identity.claims[claimIndex].created_by.id | did }}
                                    </router-link>
                                </dd>

                                <dt class="m-b-5">Attested By :</dt>
                                <dd class="mb-3" v-if="identity.claims[claimIndex].attestation">
                                    <router-link :to="{name: 'identity', params : { did: $options.filters.did(identity.claims[claimIndex].attestation.attested_by.id) }}">
                                        <Blockie :address="identity.claims[claimIndex].attestation.attested_by.id" class=""/>
                                        {{identity.claims[claimIndex].attestation.attested_by.id | did }}
                                    </router-link>
                                </dd>
                                <dd class="mb-3" v-else>
                                  N/A
                                </dd>
                                <dt class="m-t-20 m-b-5">Valid Until :</dt>
                                <dd v-if="identity.claims[claimIndex].attestation">
                                    {{identity.claims[claimIndex].attestation.valid_until | date}}
                                </dd>
                                <dd v-else>
                                  N/A
                                </dd>
                            </div>
                        </div>

                        <div class="w-25 float-left">
                            <button class="btn btn-orange text-white float-left " @click="prev" :disabled="claimIndex === 0">Previous</button>
                        </div>
                        <div class="w-50 float-left text-center pt-2">
                            <p>Showing <strong>#{{claimIndex+1}}</strong> of <strong>{{identity.claims.length}}</strong> claims</p>
                        </div>
                        <div class="w-25 float-left">
                            <button class="btn btn-orange text-white float-right" @click="next" :disabled="claimIndex === (identity.claims.length-1)">Next</button>
                        </div>
                    </div>
                </dl>
            </div>
        </div>

<!--        <div class="card">-->
<!--            <div class="card-header row m-b-0 p-b-0">-->
<!--                <div class="card-header-title">-->
<!--                    <h4>Identity Activities</h4>-->
<!--                </div>-->
<!--                <div class="card-header-icon">-->
<!--                    <h3><i class="fas fa-id-card card-title text-orange"/></h3>-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="card-body mg-b-20 p-t-0">-->
<!--                <div class="table-responsive blocks" v-if="activities.length > 0">-->
<!--                    <table class="table v-middle">-->
<!--                        <thead>-->
<!--                        <tr>-->
<!--                            <th class="border-top-0 font-weight-bold">#</th>-->
<!--                            <th class="border-top-0 font-weight-bold">Activity</th>-->
<!--                            <th class="border-top-0 font-weight-bold">Transaction Hash</th>-->
<!--                            <th class="border-top-0 font-weight-bold">Status</th>-->
<!--                            <th class="border-top-0 font-weight-bold">Timestamp</th>-->
<!--                        </tr>-->
<!--                        </thead>-->
<!--                        <tbody>-->
<!--                        <tr v-for="(activity,i) in activities">-->
<!--                            <td>{{i+1 }}</td>-->
<!--                            <td>{{activity.method.method}}</td>-->
<!--                            <td>-->
<!--                                <router-link :to="{ name: 'transaction', params: { hash: activity.hash }}"-->
<!--                                             :title="activity.hash">-->
<!--                                    {{activity.hash | truncate(32, '')}}-->
<!--                                </router-link>-->
<!--                            </td>-->
<!--                            <td>-->
<!--                                <span class="badge badge-pill badge-success font-bold" v-if="activity.isSuccess">-->
<!--                                    <i class="fa fa-check-circle"/> SUCCESS-->
<!--                                </span>-->
<!--                                <span class="badge badge-pill badge-danger font-bold" v-else>-->
<!--                                    <i class="fas fa-exclamation-circle"></i> FAILED-->
<!--                                </span>-->
<!--                            </td>-->
<!--                            <td>{{activity.timestamp.toString() | timestamp}}</td>-->
<!--                        </tr>-->
<!--                        </tbody>-->
<!--                    </table>-->
<!--                </div>-->
<!--                <div class="p-b-10" v-else>-->
<!--                    <h4 class="text-muted text-center">No Activities found</h4>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-muted" v-if="flag === 'SEARCHING'">
                        Fetching identity, please wait <img class="ml-2" src="../../../assets/images/ajax-loader.gif">
                    </h4>
                    <NotFound module="Identity" :module-id="did" v-if="flag === 'FAILURE'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from "lodash";
    import EventBus from "../../../event-bus";
    import Blockie from "../../common/Blockie";
    import VueJsonPretty from "vue-json-pretty";
    import NotFound from "../../common/NotFound";

    export default {
        name: "Identity",
        props: ["did", "hideChainDetails"],
        components: {Blockie, VueJsonPretty, NotFound},
        data() {
            return {
                identity: null,
                activities: [],
                show: false,
                flag: 'SEARCHING',
                claimIndex: 0
            }
        },
        watch : {
            $route(to, from) {
                this.init();
            }
        },
        mounted() {
            this.show = !this.hideChainDetails;
            this.init();
        },
        methods: {
            isUrl(value) {
                let r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
                return r.test(value);
            },
            async init() {
                await this.getIdentity();
                window.scrollTo(0, 0);
                // await this.getIdentityActivities();
            },
            async getIdentity() {
                if(this.did !== null) {
                    try {
                        EventBus.$emit('show');
                        let reply     = await this.$http.get(`/identities/${this.did}`);
                        this.identity = reply.data;
                        if(this.identity) {
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
            },
            async getIdentityActivities() {
                if(this.identity) {
                    try {
                        let reply       = await this.$http.get(`/identities/${this.did}/activities`);
                        this.activities = _.orderBy(reply.data, ["timestamp"], ["asc"]);
                    } catch(e) {
                        console.log(e);
                    } finally {

                    }
                }
            },
            toDateString(str) {
                let seconds = Number(str.replace(/,/g, ''));
                let d       = new Date(0);
                d.setSeconds(seconds);
                return d;
            },
            prev() {
                if(this.identity && this.claimIndex > 0) {
                    this.claimIndex--;
                }
            },
            next() {
                if(this.identity) {
                    this.claimIndex++;
                }
            }
        }
    }
</script>

<style scoped>

</style>
