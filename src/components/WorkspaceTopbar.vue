<template>
    <header>
        <div class="navbar shadow-sm">
            <div class="container d-flex justify-content-between">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <router-link :to="{name: 'home'}" class="navbar-brand d-flex align-items-center">
                        <img alt="" height="30" src="../assets/images/logo-orange-full-sm.png">
                    </router-link>
                    <button aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler"
                            data-target="#navbarNavDropdown" data-toggle="collapse" type="button">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse ml-5" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                                <router-link :to="{name: 'home'}" class="nav-link">Home <span class="sr-only">(current)</span></router-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a aria-expanded="false" aria-haspopup="true" class="nav-link dropdown-toggle"
                                   data-toggle="dropdown" href="#" id="navbarDropdownMenuLink">
                                    Blockchain
                                </a>
                                <div aria-labelledby="navbarDropdownMenuLink" class="dropdown-menu">
                                    <router-link class="dropdown-item" :to="{name: 'transactions'}">Transactions</router-link>
                                    <router-link class="dropdown-item" :to="{name: 'blocks'}">Blocks</router-link>
                                    <router-link class="dropdown-item" :to="{name: 'accounts'}">Accounts</router-link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <!--            <div class="container d-flex justify-content-between">-->
            <!--                <router-link :to="{name: 'home'}" class="navbar-brand d-flex align-items-center">-->
            <!--                    <img src="../assets/images/logo-orange-full-sm.png" alt="" height="30">-->
            <!--                </router-link>-->
            <!--            </div>-->
        </div>
    </header>
</template>

<script>
    export default {
        name: "WorkspaceTopbar",
        methods: {}
    }
</script>

<style scoped>

</style>
