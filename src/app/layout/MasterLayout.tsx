import React from 'react'
//import {AsideDefault} from '../../_metronic/layout/components/aside/AsideDefault'
import {Footer} from '../../_metronic/layout/components/Footer'
import {HeaderWrapper} from '../../_metronic/layout/components/header/HeaderWrapper'
//import {Toolbar} from '../../_metronic/layout/components/toolbar/Toolbar'
import {ScrollTop} from '../../_metronic/layout/components/ScrollTop'
//import {Content} from '../../_metronic/layout/components/Content'
import {MasterInit} from '../../_metronic/layout/MasterInit'
import {PageDataProvider} from '../../_metronic/layout/core'
import {
    DrawerMessenger,
    ExploreMain,
    ActivityDrawer,
    Main,
    InviteUsers,
    UpgradePlan,
} from '../../_metronic/partials'
import {Toolbar} from './components/Toolbar'
import { PageContainer } from './components/PageContainer'
import { AsideDefault } from './components/aside/AsideDefault'

const MasterLayout: React.FC = ({children}) => {
    return (
        <PageDataProvider>
            <div className='page d-flex flex-row flex-column-fluid'>
                <AsideDefault />
                <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
                    <HeaderWrapper />

                    <div id='kt_content' className='d-flex flex-column flex-column-fluid'>
                        {children}
                        {/* <Content>{children}</Content> */}
                        {/* <Toolbar />
                        <div className='post d-flex flex-column-fluid' id='kt_post'>
                            <Content>{children}</Content>
                        </div>  */}
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>

            {/* begin:: Drawers */}
            <ActivityDrawer />
            {/* <ExploreMain /> */}
            <DrawerMessenger />
            {/* end:: Drawers */}

            {/* begin:: Modals */}
            <Main />
            <InviteUsers />
            <UpgradePlan />
            {/* end:: Modals */}

            <MasterInit />
            <ScrollTop />
        </PageDataProvider>
    )
}

export {MasterLayout}
