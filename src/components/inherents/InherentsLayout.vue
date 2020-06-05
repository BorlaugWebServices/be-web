<template>
    <div>
        <div class="row m-b-20">
            <div class="col-5 align-self-center">
                <h3 class="page-title"><i class="fas fa-file-alt"></i> Inherents</h3>
            </div>
            <div class="col-7 align-self-center">
                <div class="d-flex no-block justify-content-end align-items-center">
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "InherentsLayout"
    }
</script>

<style scoped>

</style>