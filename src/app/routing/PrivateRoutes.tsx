import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { FallbackView } from '../../_metronic/partials'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import TestPage from '../pages/TestPage'
import { UserPage } from '../pages/user-management/UserPage'
import { RolesPage } from '../pages/roles/RolesPage'
import { PrivilegesPage } from '../pages/privileges/PrivilegesPage'
import { GsmProviderPage } from '../pages/gsmprovider/GsmProviderPage'
import { AvlUnitTypePage } from '../pages/avl-unit-type/AvlUnitTypePage'
import { AccessoriesPage } from '../pages/accessories/AccessoriesPage'
import { HolidayPage } from '../pages/holiday/HolidayPage'
import { AvlUnitListPage } from '../pages/avl-unit-list/AvlUnitListPage'
import { MHubPage } from '../pages/mhub/MHubPage'
import { GsmCardListPage } from '../pages/gsm-card/GsmCardListPage'
import { VehicleTypePage } from '../pages/vehicle-type/VehicleTypePage'
import { LocationPage } from '../pages/location/LocationPage'
import { LocationTypePage } from '../pages/location-type/LocationTypePage'
import { CustomerPage } from '../pages/customer/CustomerPage'
import { MemberPage } from '../pages/member/MemberPage'
import { MemberListPage } from '../pages/member/MemberListPage'
import { SupplierPage } from '../pages/supplier/SupplierPage'
import { SupplierListPage } from '../pages/supplier/SupplierListPage'
import { ProductPage } from '../pages/product/ProductPage'
import { ProductList } from '../pages/product/ProductList'

import { PurchasePage } from '../pages/purchase/PurchasePage'
import { PurchaseList } from '../pages/purchase/PurchaseList'

export function PrivateRoutes() {
    const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
    const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
    const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
    const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
    const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
    const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))

    return (
        <Suspense fallback={<FallbackView />}>
            <Switch>
                <Route path='/dashboard' component={DashboardWrapper} />
                <Route exact path='/member' component={MemberListPage} />
                <Route path='/member/:id' component={MemberPage} />
                <Route exact path='/supplier' component={SupplierListPage} />
                <Route path='/supplier/:id' component={SupplierPage} />
                <Route exact path='/product' component={ProductList} />
                <Route path='/product/:id' component={ProductPage} />
                <Route exact path='/purchase' component={PurchaseList} />
                <Route path='/purchase/:id' component={PurchasePage} />

                <Route path='/builder' component={BuilderPageWrapper} />
                <Route path='/crafted/pages/profile' component={ProfilePage} />
                <Route path='/crafted/pages/wizards' component={WizardsPage} />
                <Route path='/crafted/widgets' component={WidgetsPage} />
                <Route path='/crafted/account' component={AccountPage} />
                <Route path='/apps/chat' component={ChatPage} />
                <Route path='/menu-test' component={MenuTestPage} />
                <Route path='/test' component={TestPage} />
                <Route path='/location-type' component={LocationTypePage} />
                <Route path='/customer' component={CustomerPage} />
                <Route path='/user' component={UserPage} />
                <Route path='/role' component={RolesPage} />
                <Route path='/privilege' component={PrivilegesPage} />
                <Route path='/avl-unit-type' component={AvlUnitTypePage} />
                <Route path='/gsm-provider' component={GsmProviderPage} />
                <Route path='/accessory' component={AccessoriesPage} />
                <Route path='/holiday' component={HolidayPage} />
                <Route path='/avl-unit-list' component={AvlUnitListPage} />
                <Route path='/mhub' component={MHubPage} />
                <Route path='/gsm-card' component={GsmCardListPage} />
                <Route path='/vehicle-type' component={VehicleTypePage} />
                <Route path='/location' component={LocationPage} />
                <Redirect from='/auth' to='/dashboard' />
                <Redirect exact from='/' to='/dashboard' />
                <Redirect to='error/404' />
            </Switch>
        </Suspense>
    )
}
