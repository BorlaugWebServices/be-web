<template>
    <div class="row">
        <div class="col-12">
            <ExplorerCard :icon-class="icon" body-class="m-t-0 p-0">
                <template #title>
                    <h5 v-if="show">Showing {{items.length}} of {{total}} {{entityName}}</h5>
                </template>

                <div class="table-responsive blocks">
                    <table class="table v-middle">
                        <thead>
                        <tr class="border-0">
                            <th class="border-0"></th>
                            <th class="border-0 font-weight-bold" v-for="header in headers" :key="header">{{ header }}</th>
                            <th class="border-0"></th>
                        </tr>
                        </thead>
                        <tbody>
                            <slot name="body" :items="items"></slot>
                        </tbody>
                    </table>
                </div>
            </ExplorerCard>
        </div>
        <div class="col-lg-12">
            <div class="text-right">
                <nav aria-label="Page navigation example">
                    <paginate
                            :click-handler="pageHandler"
                            :container-class="'pagination justify-content-end'"
                            :margin-pages="2"
                            :page-count="pageCount"
                            :page-range="1"
                            :prev-text="'Prev'"
                            :next-text="'Next'"
                            :no-li-surround="false"
                            :page-class="'page-item'"
                            :page-link-class="'page-link'"
                            :prev-class="'page-item'"
                            :prev-link-class="'page-link'"
                            :next-class="'page-item'"
                            :next-link-class="'page-link'"
                            :break-view-link-class="'break-view-link'">
                    </paginate>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import ExplorerCard from "./ExplorerCard.vue";
    import Paginate from 'vuejs-paginate-next';

    export default {
        name: "PaginatedTable",
        components: {ExplorerCard, Paginate},
        props: {
            icon: {
                type: String,
                required: true
            },
            entityName: {
                type: String,
                required: true
            },
            headers: {
                type: Array,
                required: true
            },
            items: {
                type: Array,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            pageCount: {
                type: Number,
                required: true
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            pageHandler(pageNum) {
                this.$emit('page-change', pageNum);
            }
        }
    }
</script>

<style scoped>
    .blocks table td {
        padding: 1em 1em !important;
        vertical-align: top !important;
    }

    .blocks table th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6 !important;
    }
</style>