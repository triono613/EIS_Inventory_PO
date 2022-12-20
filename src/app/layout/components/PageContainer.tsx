import React, {useEffect} from 'react'
import {useLocation} from 'react-router'
import clsx from 'clsx'
import { useLayout } from '../../../_metronic/layout/core'
import { DrawerComponent } from '../../../_metronic/assets/ts/components'
//import {useLayout} from '../core'
//import {DrawerComponent} from '../../assets/ts/components'

const PageContainer: React.FC = ({children}) => {
    const {classes} = useLayout()
    const location = useLocation()
    useEffect(() => {
        DrawerComponent.hideAll()
    }, [location])

    return (
        <div id='page_container' className='container-fluid h-100'>
            {children}
        </div>
    )
}

export {PageContainer}
