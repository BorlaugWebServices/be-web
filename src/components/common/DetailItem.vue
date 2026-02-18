<template>
    <div>
        <dl class="row mb-0">
            <div :class="labelClass">
                <dt>{{ title }}</dt>
            </div>
            <div :class="valueClass">
                <dd class="mb-1">
                    <slot></slot>
                </dd>
            </div>
        </dl>
        <hr style="height: 1px" v-if="!noSeparator"/>
    </div>
</template>

<script>
    export default {
        name: "DetailItem",
        props: {
            title: String,
            labelClass: {
                type: String,
                default: "col-sm-2 text-sm-right"
            },
            valueClass: {
                type: String,
                default: "col-sm-10 text-sm-left"
            },
            noSeparator: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
