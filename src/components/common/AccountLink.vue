<template>
    <router-link :to="{name: 'view-account', params: { address: address }}">
        <div class="float-left mr-2">
            <Blockie :address="address" class="mm-5-0-5-0"/>
        </div>
        <div class="float-left adjust-40">
            <span :title="address" class="align-middle word-break">{{ address }}</span>
        </div>
    </router-link>
</template>

<script>
    import Blockie from "./Blockie.vue";

    export default {
        name: "AccountLink",
        props: ["address"],
        components: {Blockie}
    }
</script>
