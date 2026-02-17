import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import("@/components/Workspace.vue"),
        children: [
            {
                path: "",
                name: "home",
                component: () => import("@/components/Home.vue")
            },
            {
                path: "terms",
                name: "terms",
                component: () => import("@/components/public/Terms.vue")
            },
            {
                path: "privacy",
                name: "privacy",
                component: () => import("@/components/public/Privacy.vue")
            },
            {
                path: "stakeholders",
                name: "stakeholders",
                component: () => import("@/components/public/Stakeholders.vue")
            },
            {
                path: 'blocks',
                component: () => import("@/components/blocks/BlocksLayout.vue"),
                children: [
                    {
                        path: "",
                        name: "blocks",
                        component: () => import("@/components/blocks/Blocks.vue")
                    },
                    {
                        path: ":number",
                        name: "block",
                        props: true,
                        component: () => import("@/components/blocks/Block.vue"),
                    },
                    {
                        path: ":number/sync",
                        name: "sync-block",
                        props: true,
                        component: () => import("@/components/blocks/SyncBlock.vue"),
                    }
                ]
            },
            {
                path: 'tx',
                component: () => import("@/components/transactions/TransactionsLayout.vue"),
                children: [
                    {
                        path: "",
                        name: "transactions",
                        component: () => import("@/components/transactions/Transactions.vue")
                    },
                    {
                        path: ":hash",
                        name: "transaction",
                        props: true,
                        component: () => import("./components/transactions/Transaction.vue"),
                    },
                    {
                        path: ":blockhashornumber/:txhash",
                        name: "transaction-from-chain",
                        props: true,
                        component: () => import("./components/transactions/TransactionFromChain.vue"),
                    }
                ]
            },
            {
                path: 'accounts',
                component: () => import("@/components/accounts/AccountLayout"),
                children: [
                    {
                        path: "",
                        name: "accounts",
                        component: () => import("@/components/accounts/Accounts")
                    },
                    {
                        path: ":address",
                        name: "view-account",
                        props: true,
                        component: () => import("@/components/accounts/Account"),
                    }
                ]
            },
            {
                path: 'inherents',
                component: () => import("@/components/inherents/InherentsLayout.vue"),
                children: [
                    {
                        path: ":inherentid",
                        name: "inherent",
                        props: true,
                        component: () => import("@/components/inherents/Inherent.vue"),
                    }
                ]
            },
            {
                path: 'events',
                component: () => import("@/components/events/EventsLayout.vue"),
                children: [
                    {
                        path: ":eventid",
                        name: "event",
                        props: true,
                        component: () => import("@/components/events/Event.vue"),
                    }
                ]
            },
            {
                path: 'logs',
                component: () => import("@/components/logs/LogsLayout.vue"),
                children: [
                    {
                        path: ":logid",
                        name: "log",
                        props: true,
                        component: () => import("@/components/logs/Log.vue"),
                    }
                ]
            },
            {
                path: 'assetregistry',
                component: () => import("@/components/objects/AssetRegistry/Layout.vue"),
                children: [
                    {
                        path: "registries/:registryid",
                        name: "asset-registry",
                        props: true,
                        component: () => import("@/components/objects/AssetRegistry/Registry.vue"),
                    },
                    {
                        path: "assets/:assetid",
                        name: "asset",
                        props: true,
                        component: () => import("@/components/objects/AssetRegistry/Asset.vue"),
                    },
                    {
                        path: "leases/:leaseid",
                        name: "lease",
                        props: true,
                        component: () => import("@/components/objects/AssetRegistry/Lease.vue"),
                    }
                ]
            },
            {
                path: 'identity',
                component: () => import("@/components/objects/Identity/Layout.vue"),
                children: [
                    {
                        path: ":did",
                        name: "identity",
                        props: true,
                        component: () => import("@/components/objects/Identity/Identity.vue"),
                    }
                ]
            },
            {
                path: 'audit',
                component: () => import("@/components/objects/Audit/Layout.vue"),
                children: [
                    {
                        path: ":auditid",
                        name: "audit",
                        props: true,
                        component: () => import("@/components/objects/Audit/Audit.vue"),
                    }
                ]
            },
            {
                path: 'groups',
                component: () => import("@/components/objects/Groups/Layout.vue"),
                children: [
                    {
                        path: ":groupid",
                        name: "group",
                        props: true,
                        component: () => import("@/components/objects/Groups/Group.vue"),
                    }
                ]
            },
            {
                path: 'proposals',
                component: () => import("@/components/objects/Proposal/Layout.vue"),
                children: [
                    {
                        path: ":proposalid",
                        name: "proposal",
                        props: true,
                        component: () => import("@/components/objects/Proposal/Proposal.vue"),
                    }
                ]
            },
            {
                path: 'provenance',
                component: () => import("@/components/objects/Provenance/Layout.vue"),
                children: [
                    {
                        path: "process/:processid",
                        name: "process",
                        props: true,
                        component: () => import("@/components/objects/Provenance/Process.vue"),
                    },
                    {
                        path: "registries/:registryid",
                        name: "registry",
                        props: true,
                        component: () => import("@/components/objects/Provenance/Registry.vue"),
                    },
                    {
                        path: "definitions/:definitionid",
                        name: "definition",
                        props: true,
                        component: () => import("@/components/objects/Provenance/ProcessDefinition.vue"),
                    }
                ]
            },
            {
                path: 'catalog',
                component: () => import("@/components/objects/Catalog/Layout.vue"),
                children: [
                    {
                        path: ":catalogid",
                        name: "catalog",
                        props: true,
                        component: () => import("@/components/objects/Catalog/Catalog.vue"),
                    }
                ]
            },
            {
                path: "404",
                name: "404",
                props: {isPage: true},
                component: () => import("@/components/common/NotFound.vue")
            },
            {path: '/:pathMatch(.*)*', redirect: '/404'}
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
