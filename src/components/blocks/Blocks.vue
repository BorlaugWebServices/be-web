<template>
    <PaginatedTable
        icon="fa fa-cubes"
        entityName="blocks"
        :headers="['Number', 'Age', 'Transactions', 'Inherents', 'Events', 'Logs']"
        :items="blocks"
        :total="total"
        :pageCount="pageCount"
        :show="show"
        @page-change="pageHandler"
    >
        <template #body="{ items }">
            <tr class="p-t-0 p-b-0" v-bind:key="index" v-for="(block, index) in items">
                <td>
                    <i class="fa fa-cube"></i>
                </td>
                <td>
                    <div class="d-flex no-block align-items-center">
                        <router-link :to="{name: 'block', params: {number: block.number}}">{{ block.number}}</router-link>
                    </div>
                </td>
                <td>
                    <age v-if="block.timestamp" :timestamp="block.timestamp"/>
                </td>
                <td>
                    {{block.transactions.length}}
                </td>
                <td>
                    {{block.inherents.length}}
                </td>
                <td>
                    {{block.events.length}}
                </td>
                <td>
                    {{block.logs.length}}
                </td>
                <td class="text-right">
                    <router-link :to="{name: 'block', params: {number: block.number}}" class="btn btn-sm btn-orange text-white">
                        Details
                    </router-link>
                </td>
            </tr>
        </template>
    </PaginatedTable>
</template>

<script>
    import EventBus from "../../event-bus";
    import Age from "../common/Age.vue";
    import PaginatedTable from "../common/PaginatedTable.vue";

    export default {
        name: "Blocks",
        components: {Age, PaginatedTable},
        data() {
            return {
                blocks: [],
                total: 0,
                pageCount: 1,
                show: false,
                perPage: localStorage.getItem("perPage") || 10
            };
        },
        mounted() {
            this.getRecentBlocks(1);
        },
        methods: {
            async getRecentBlocks(page) {
                try {
                    EventBus.emit('show');
                    let reply   = await this.axios.get("/blocks", {
                        params: {
                            page: page,
                            perPage: this.perPage
                        }
                    });
                    this.blocks = reply.data.slice;
                    this.total  = reply.data.total;
                    this.setPageCount();
                    this.show = true;
                } catch(e) {

                } finally {
                    EventBus.emit('hide');
                }
            },
            pageHandler(pageNum) {
                this.getRecentBlocks(pageNum);
            },
            setPageCount() {
                this.pageCount = this.total <= 10 ? 1 : Math.ceil(this.total / 10);
            }
        }
    }
</script>

<style scoped>
    .block {
        width: 200px;
        min-width: 200px;
    }
</style>