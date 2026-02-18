<template>
    <div>
        <div class="row m-b-20">
            <div class="col-5 align-self-center">
                <h3 class="page-title"><i :class="icon"></i> {{ title }}</h3>
            </div>
            <div class="col-7 align-self-center">
                <div class="d-flex no-block justify-content-end align-items-center">
                    <slot name="actions"></slot>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "PageLayout",
        props: {
            title: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>