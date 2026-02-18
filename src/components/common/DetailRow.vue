<template>
    <div>
        <dl :class="rowClass">
            <div class="col-sm-2 text-sm-right">
                <dt>{{ label }}</dt>
            </div>
            <div class="col-sm-10 text-sm-left">
                <dd class="mb-1">
                    <slot></slot>
                </dd>
            </div>
        </dl>
        <hr v-if="withHr"/>
    </div>
</template>

<script>
export default {
    name: "DetailRow",
    props: {
        label: {
            type: String,
            required: true
        },
        withHr: {
            type: Boolean,
            default: true
        },
        rowClass: {
            type: String,
            default: "row mb-0"
        }
    }
}
</script>

<style scoped>

</style>
