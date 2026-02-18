<template>
    <ExplorerCard title="Search Results" icon-class="fa fa-search">
        <template #icon>
            <h3>
                <a href="javascript:void(0);">
                    <i class="fa fa-search card-title text-orange"/>
                </a>
            </h3>
        </template>

        <div class="card-body" v-if="searchResult && searchResult.blocks.length === 0 && searchResult.txns.length === 0
                    && searchResult.leases.length === 0 && searchResult.inherents.length === 0
                    && searchResult.events.length === 0 && searchResult.logs.length === 0
                    && searchResult.identities.length === 0 && searchResult.sequences.length === 0 && searchResult.address.length === 0 && searchResult.audits.length === 0
                    && searchResult.groups.length === 0 && searchResult.proposals.length === 0 && searchResult.catalogs.length === 0 && searchResult.asset_registries.length === 0 && searchResult.assets.length === 0
                         && searchResult.registries.length === 0 && searchResult.definitions.length === 0">
            <div class="row justify-content-center">
                <div class="col-md-12 text-center text-muted">
                                <span class="display-1 d-block">
                                    <i class="fa fa-exclamation-triangle"/>
                                </span>
                    <div class="mb-4 lead">Nothing found.</div>
                    <a @click="clear" class="font-weight-bold text-orange" href="javascript:void(0);">
                        Clear</a>
                </div>
            </div>
        </div>

        <div class="card-body m-t-0 p-0" v-else>
            <div class="table-responsive blocks">
                <table class="table v-middle">
                    <tbody v-if="searchResult">
                    <tr v-for="block in searchResult.blocks">
                        <td>
                            <router-link :to="{ name : 'block' , params: { number: block.number }}">
                                <h4>Block: {{block.number}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Hash :</span> {{block.hash}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{block.timestamp}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="address in searchResult.address">
                        <td>
                            <router-link
                                :to="{ name : 'view-account' , params: { address: address.signer }}">
                                <h4>Address: {{address.signer}}</h4>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="txn in searchResult.txns">
                        <td>
                            <router-link
                                :to="{ name : 'transaction-from-chain' , params: { blockhash: block.hash, txhash: txn.hash }}">
                                <h4>Transaction: {{txn.hash}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{txn.blockNumber}} |
                                    <span class="font-weight-bold">Module :</span> {{txn.method.section}} |
                                    <span class="font-weight-bold">Method :</span> {{txn.method.method}} |
                                    <span class="font-weight-bold">Signer :</span> {{txn.signer}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="lease in searchResult.leases">
                        <td>
                            <router-link :to="{ name : 'lease' , params: { leaseid: lease.id }}">
                                <h4>Lease: {{lease.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{lease.blockNumber}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="registry in searchResult.asset_registries">
                        <td>
                            <router-link
                                :to="{ name : 'asset-registry' , params: { registryid: registry.id }}">
                                <h4>Asset Registry: {{registry.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{registry.blockNumber}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="asset in searchResult.assets">
                        <td>
                            <router-link :to="{ name : 'asset' , params: { assetid: asset.id }}">
                                <h4>Asset: {{asset.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{asset.blockNumber}} |
                                    <span class="font-weight-bold">Reistry :</span> {{asset.registry_id}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="audit in searchResult.audits">
                        <td>
                            <router-link :to="{ name : 'audit' , params: { auditid: audit.id }}">
                                <h4>Audit: {{audit.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{audit.blockNumber}} |
                                    <span class="font-weight-bold">Creator :</span> {{audit.audit_creator}}
                                    |
                                    <span class="font-weight-bold">Auditor :</span> {{audit.auditor}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="identity in searchResult.identities">
                        <td>
                            <router-link :to="{ name : 'identity' , params: { did: getDid(identity.did) }}">
                                <h4>{{ formatters.did(identity.did) }}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{identity.blockNumber}} |
                                    <span class="font-weight-bold">Tx Hash :</span>
                                    {{identity.extrinsicHash}}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="inherent in searchResult.inherents">
                        <td>
                            <router-link :to="{ name : 'inherent' , params: { inherentid: inherent.id }}">
                                <h4>Inherent: {{inherent.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{inherent.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(inherent.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="event in searchResult.events">
                        <td>
                            <router-link :to="{ name : 'event' , params: { eventid: event.id }}">
                                <h4>Event: {{event.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{event.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(event.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="log in searchResult.logs">
                        <td>
                            <router-link :to="{ name : 'log' , params: { logid: log.id }}">
                                <h4>Log: {{log.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Block :</span> {{log.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(log.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="sequence in searchResult.sequences">
                        <td>
                            <router-link :to="{ name : 'process' , params: { processid: sequence.id }}">
                                <h4>Provenance: {{sequence.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Registry :</span> {{sequence.registry}} |
                                    <span class="font-weight-bold">Template :</span> {{sequence.template}} |
                                    <span class="font-weight-bold">Block :</span> {{sequence.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(sequence.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="group in searchResult.groups">
                        <td>
                            <router-link :to="{ name : 'group' , params: { groupid: group.id }}">
                                <h4>Group: {{group.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Group Creator :</span>
                                    {{group.group_creator}} |
                                    <span class="font-weight-bold">Block :</span> {{group.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(group.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="proposal in searchResult.proposals">
                        <td>
                            <router-link :to="{ name : 'proposal' , params: { proposalid: proposal.id }}">
                                <h4>Proposal: {{proposal.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Proposer :</span> {{proposal.proposer}} |
                                    <span class="font-weight-bold">Block :</span> {{proposal.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(proposal.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="catalog in searchResult.catalogs">
                        <td>
                            <router-link :to="{ name : 'catalog' , params: { catalogid: catalog.id }}">
                                <h4>Catalog: {{catalog.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Creator :</span> {{catalog.caller}} |
                                    <span class="font-weight-bold">Controller :</span>
                                    {{catalog.controller}} |
                                    <span class="font-weight-bold">Block :</span> {{catalog.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(catalog.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="catalog in searchResult.catalogs">
                        <td>
                            <router-link :to="{ name : 'catalog' , params: { catalogid: catalog.id }}">
                                <h4>Catalog: {{catalog.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Creator :</span> {{catalog.caller}} |
                                    <span class="font-weight-bold">Controller :</span>
                                    {{catalog.controller}} |
                                    <span class="font-weight-bold">Block :</span> {{catalog.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(catalog.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="registry in searchResult.registries">
                        <td>
                            <router-link :to="{ name : 'registry' , params: { registryid: registry.id }}">
                                <h4>Provenance Registry: {{registry.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Creator :</span> {{registry.creator}} |
                                    <span class="font-weight-bold">Creator Group :</span>
                                    {{registry.creator_group}} |
                                    <span class="font-weight-bold">Block :</span> {{registry.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(registry.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="definition in searchResult.definitions">
                        <td>
                            <router-link :to="{ name : 'definition' , params: { definitionid: definition.id }}">
                                <h4>Process Definition: {{definition.id}}</h4>
                                <small class="text-secondary">
                                    <span class="font-weight-bold">Creator :</span> {{definition.creator}} |
                                    <span class="font-weight-bold">Controller :</span>
                                    {{definition.controller}} |
                                    <span class="font-weight-bold">Block :</span> {{definition.blockNumber}} |
                                    <span class="font-weight-bold">Timestamp :</span> {{ formatters.from_ms(definition.timestamp) }}
                                </small>
                            </router-link>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </ExplorerCard>
</template>

<script>
    import ExplorerCard from "@/components/common/ExplorerCard.vue";
    import { formatters } from "@/utils/formatters";

    export default {
        name: "SearchResults",
        components: {ExplorerCard},
        props: {
            searchResult: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                formatters: formatters
            }
        },
        methods: {
            clear() {
                this.$emit('clear-search');
            },
            getDid(did) {
                return formatters.did(did);
            }
        }
    }
</script>

<style scoped>
    .blocks table td {
        padding: 1em 1em !important;
        vertical-align: top !important;
    }
</style>
