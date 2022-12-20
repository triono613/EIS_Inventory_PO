/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC} from 'react'
import {DefaultTitle} from '../../../_metronic/layout/components/header/page-title/DefaultTitle'
import {useLayout} from '../../../_metronic/layout/core'
//import {KTSVG} from '../../../helpers'
//import {useLayout} from '../../core'
//import {DefaultTitle} from '../header/page-title/DefaultTitle'

export interface SubHeaderParams {
//    title: string | React.ReactNode,
    toolbar: React.ReactNode | undefined
}

const SubHeader: FC<SubHeaderParams> = ({ toolbar}) => {
    const {classes} = useLayout()

    return (
        <div className='toolbar' id='kt_toolbar'>
            {/* begin::Container */}
            <div
                id='kt_toolbar_container'
                className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
            >
                <DefaultTitle />

                {/* begin::Actions */}
                <div className='d-flex align-items-center'>
                    {toolbar}
                </div>
                {/* end::Actions */}
            </div>
            {/* end::Container */}
        </div>
    )
}

export {SubHeader}
