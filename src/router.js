import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: resolve => require(["@/components/Workspace.vue"], resolve),
            children: [
                {
                    path: "",
                    name: "home",
                    component: resolve => require(["@/components/Home.vue"], resolve)
                },
                {
                    path: "terms",
                    name: "terms",
                    component: resolve => require(["@/components/public/Terms.vue"], resolve)
                },
                {
                    path: "privacy",
                    name: "privacy",
                    component: resolve => require(["@/components/public/Privacy.vue"], resolve)
                },
                {
                    path: "stakeholders",
                    name: "stakeholders",
                    component: resolve => require(["@/components/public/Stakeholders.vue"], resolve)
                },
                {
                    path: 'blocks',
                    component: resolve => require(["@/components/blocks/BlocksLayout.vue"], resolve),
                    children: [
                        {
                            path: "",
                            name: "blocks",
                            component: resolve => require(["@/components/blocks/Blocks.vue"], resolve)
                        },
                        {
                            path: ":number",
                            name: "block",
                            props: true,
                            component: resolve => require(["@/components/blocks/Block.vue"], resolve),
                        }
                    ]
                },
                {
                    path: 'tx',
                    component: resolve => require(["@/components/transactions/TransactionsLayout.vue"], resolve),
                    children: [
                        {
                            path: "",
                            name: "transactions",
                            component: resolve => require(["@/components/transactions/Transactions.vue"], resolve)
                        },
                        {
                            path: ":hash",
                            name: "transaction",
                            props: true,
                            component: resolve => require(["@/components/transactions/Transaction.vue"], resolve),
                        }
                    ]
                },
                {
                    path: 'inherents',
                    component: resolve => require(["@/components/inherents/InherentsLayout.vue"], resolve),
                    children: [
                        {
                            path: ":inherentid",
                            name: "inherent",
                            props: true,
                            component: resolve => require(["@/components/inherents/Inherent.vue"], resolve),
                        }
                    ]
                },
                {
                    path: 'events',
                    component: resolve => require(["@/components/events/EventsLayout.vue"], resolve),
                    children: [
                        {
                            path: ":eventid",
                            name: "event",
                            props: true,
                            component: resolve => require(["@/components/events/Event.vue"], resolve),
                        }
                    ]
                },
                {
                    path: 'logs',
                    component: resolve => require(["@/components/logs/LogsLayout.vue"], resolve),
                    children: [
                        {
                            path: ":logid",
                            name: "log",
                            props: true,
                            component: resolve => require(["@/components/logs/Log.vue"], resolve),
                        }
                    ]
                },
                {
                    path: 'lease',
                    component: resolve => require(["@/components/objects/AssetRegistry/Layout.vue"], resolve),
                    children: [
                        {
                            path: ":leaseid",
                            name: "lease",
                            props: true,
                            component: resolve => require(["@/components/objects/AssetRegistry/Lease.vue"], resolve),
                        }
                    ]
                },
                {
                    path: 'identity',
                    component: resolve => require(["@/components/objects/Identity/Layout.vue"], resolve),
                    children: [
                        {
                            path: ":did",
                            name: "identity",
                            props: true,
                            component: resolve => require(["@/components/objects/Identity/Identity.vue"], resolve),
                        }
                    ]
                }
            ]
        }
    ]
})
