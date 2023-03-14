import { IconName } from '@fortawesome/fontawesome-common-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faBuilding,
    faEdit,
    faFileCertificate,
    faGlobeAsia,
    faHome,
    faHdd,
    faInbox,
    faSimCard,
    faTrash,
    faTruck,
    faUserCog,
    faUserTie,
    faHandHoldingBox,
    faFileInvoiceDollar,
    faInventory,
} from '@fortawesome/pro-duotone-svg-icons'

library.add(faBuilding, faEdit, faFileCertificate, faFileInvoiceDollar,
    faGlobeAsia,
    faHandHoldingBox,
    faHdd, faHome, faInbox, faInventory, faSimCard, faTrash, faTruck, faUserCog, faUserTie)

interface MenuItemConfig {
    id: string
    title: string
    route: string
    icon?: IconName | undefined
    privilege: string | Array<string>
    children?: Array<MenuItemConfig> | undefined
}

const MainMenuConfig: Array<MenuItemConfig> = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        route: '/dashboard',
        icon: 'home',
        privilege: '*',
    },
    {
        id: 'purchase',
        title: 'Purchasing',
        route: '',
        icon: 'truck',
        privilege: '*',
        children: [
            {
                id: 'purchase-list-xx',
                title: 'Purchase Order',
                route: '/',
                privilege: '*',
                children: [
                    {
                        id: 'view-purchase-nnn',
                        title: 'View Purchase',
                        route: '/purchase',
                        privilege: '*',
                    },
                   
                ],
            },
            {
                id: 'supplier-return-list',
                title: 'Supplier Returns',
                route: '/',
                privilege: '*',
                children: [
                    {
                        id: 'view-supplier-return',
                        title: 'View Supplier Return',
                        route: '/supplier-return',
                        privilege: '*',
                    },
                  
                ],
            },


        ],
    },
    {
        id: 'inventory',
        title: 'Inventory',
        route: '',
        icon: 'inventory',
        privilege: '*',
        children: [
            {
                id: 'transaksi',
                title: 'Transaksi',
                route: '/transaksi',
                privilege: '*',
                children: [
                    {
                        id: 'good-receipt',
                        title: 'GoodsReceipt',
                        route: '/good-receipt',
                        privilege: '*',
                    },
                    {
                        id: 'inventory-transfer',
                        title: 'InventoryTransfers',
                        route: '/inventory-transfer',
                        privilege: '*',
                    },
                    {
                        id: 'delivery-order',
                        title: 'DeliveryOrders',
                        route: '/delivery-order',
                        privilege: '*',
                    },
                    {
                        id: 'stock-opname',
                        title: 'StockOpname',
                        route: '/stock-opname',
                        privilege: '*',
                    },
                    {
                        id: 'stock',
                        title: 'Stock',
                        route: '/stock',
                        privilege: '*',
                    },
                ]
            },
            {
                id: 'nav-products',
                title: 'Products',
                route: '',
                privilege: '*',
                children: [
                    {
                        id: 'products',
                        title: 'View Products',
                        route: '/product',
                        privilege: '*',
                    },
                ]
            },
          
        ],
    },
    {
        id: 'sales',
        title: 'Sales ',
        route: '',
        icon: 'inventory',
        privilege: '*',
        children: [
            {
                id: 'sales-orders',
                title: 'Orders',
                route: '/sales-orders',
                privilege: '*',
                children: [
                    
                    {
                        id: 'view-sales-order',
                        title: 'View Sales Order',
                        route: '/view-sales-order',
                        privilege: '*',
                    },
                  
                ]
            },
            {
                id: 'nav-products',
                title: 'Products',
                route: '',
                privilege: '*',
                children: [
                    {
                        id: 'products',
                        title: 'View Products',
                        route: '/product',
                        privilege: '*',
                    },
                ]
            },
          
        ],
    },
    {
        id: 'member',
        title: 'Members',
        route: '',
        icon: 'building',
        privilege: '*',
        children: [
            {
                id: 'member-list',
                title: 'Members',
                route: '/member',
                privilege: '*',
            },
            {
                id: 'contract',
                title: 'Contracts',
                route: '/contract',
                privilege: '*',
            },
            {
                id: 'vehicle',
                title: 'Vehicles',
                route: '/vehicle',
                privilege: '*',
            },
        ],
    },

    {
        id: 'supplier',
        title: 'Supplier',
        route: '/supplier',
        icon: 'truck',
        privilege: '*',
    },
  
    {
        id: 'avl-unit',
        title: 'AvlUnits',
        route: '/avl-unit',
        icon: 'hdd',
        privilege: '*',
        children: [
            {
                id: 'avl-unit-list',
                title: 'AvlUnitList',
                route: '/avl-unit-list',
                privilege: '*',
            },
            {
                id: 'mhub',
                title: 'MHub',
                route: '/mhub',
                privilege: '*',
            },
        ],
    },
    {
        id: 'gsm-card',
        title: 'GsmCards',
        route: '/gsm-card',
        icon: 'sim-card',
        privilege: '*',
    },
    {
        id: 'service',
        title: 'Services',
        route: '',
        icon: 'hand-holding-box',
        privilege: '*',
        children: [
            {
                id: 'avl-unit-rental',
                title: 'AvlUnitRental',
                route: '/avl-unit-rental',
                privilege: '*',
            },
            {
                id: 'location',
                title: 'Locations',
                route: '/location',
                privilege: '*',
            },
        ],
    },
    {
        id: 'billing',
        title: 'Billing',
        route: '',
        icon: 'file-invoice-dollar',
        privilege: '*',
        children: [
            {
                id: 'invoice',
                title: 'Invoices',
                route: '/invoice',
                privilege: '*',
            },
            {
                id: 'invoice-reminder',
                title: 'InvoiceReminder',
                route: '/invoice-reminder',
                privilege: '*',
            },
        ],
    },

    {
        id: 'administration',
        title: 'Administration',
        route: '/administration',
        icon: 'user-cog',
        privilege: '*',
        children: [
            {
                id: 'user',
                title: 'Users',
                route: '/user',
                privilege: '*',
            },
            {
                id: 'role',
                title: 'Roles',
                route: '/role',
                privilege: '*',
            },
            {
                id: 'privilege',
                title: 'Privileges',
                route: '/privilege',
                privilege: '*',
            },
            {
                id: 'gsm-provider',
                title: 'GsmProviders',
                route: '/gsm-provider',
                privilege: '*',
            },
            {
                id: 'avl-unit-type',
                title: 'AvlUnitTypes',
                route: '/avl-unit-type',
                privilege: '*',
            },
            {
                id: 'accessoriy',
                title: 'Accessories',
                route: '/accessory',
                privilege: '*',
            },
            {
                id: 'holiday',
                title: 'Holidays',
                route: '/holiday',
                privilege: '*',
            },
        ],
    },
]

export type { MenuItemConfig }
export default MainMenuConfig
