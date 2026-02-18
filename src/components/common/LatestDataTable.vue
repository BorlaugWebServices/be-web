<template>
    <ExplorerCard :title="title" title-tag="h3" :icon-class="icon" body-class="m-t-0 p-0">
        <template #icon>
            <h3>
                <a href="javascript:void(0);">
                    <i :class="icon" class="card-title text-orange"/>
                </a>
            </h3>
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

        <template #footer>
            <slot name="footer"></slot>
        </template>
    </ExplorerCard>
</template>

<script>
    import ExplorerCard from "./ExplorerCard.vue";

    export default {
        name: "LatestDataTable",
        components: {ExplorerCard},
        props: {
            title: {
                type: String,
                required: true
            },
            icon: {
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