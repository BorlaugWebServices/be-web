<template>
    <footer class="container py-5">
        <div class="row">
            <div class="col-12 col-md">
                <div class="m-b-20"><img src="../assets/images/logo-orange.png" alt="" height="30"></div>
                <small class="d-block mb-3 text-muted">&copy; 2017-2020</small>
            </div>
            <div class="col-6 col-md">
                <h5>About Us</h5>
                <ul class="list-unstyled text-small">
                    <li><a class="text-muted" href="https://www.borlaug.ws/" target="_blank">Company</a></li>
                </ul>
            </div>
            <div class="col-6 col-md">
                <h5>Contact Us</h5>
                <ul class="list-unstyled text-small">
                    <li><a class="text-muted" href="javascript:void(0)">info@borlaug.ws</a></li>
                </ul>
            </div>
            <div class="col-6 col-md">
                <h5>Resources</h5>
                <ul class="list-unstyled text-small">
                    <li><a class="text-muted" href="https://www.borlaug.ws/bws-sales-private" target="_blank">Documentation</a></li>
                </ul>
            </div>
            <div class="col-6 col-md">
                <h5>Legal</h5>
                <ul class="list-unstyled text-small">
                    <li><a class="text-muted" href="/privacy">Privacy</a></li>
                    <li><a class="text-muted" href="/terms">Terms</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "WorkspaceFooter",
        data() {
            return {
                version: ""
            }
        },
        mounted() {
            this.release();
        },
        methods: {
            release() {
                this.$http.get('/')
                .then(reply => {
                    this.version = reply.data.version;
                })
                .catch(err => console.log(err))
            }
        }
    }
</script>

<style scoped>

</style>
