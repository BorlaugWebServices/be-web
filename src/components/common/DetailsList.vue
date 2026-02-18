<template>
    <div>
        <div v-for="(item, index) in items" :key="index">
            <dl class="row mb-0">
                <div class="col-sm-2 text-sm-right">
                    <dt>{{ item.label }}</dt>
                </div>
                <div class="col-sm-10 text-sm-left">
                    <dd class="mb-1">
                        <slot :name="item.slotName || 'default'" :item="item">
                            {{ item.value }}
                        </slot>
                    </dd>
                </div>
            </dl>
            <hr v-if="index < items.length - 1"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailsList",
        props: {
            items: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>