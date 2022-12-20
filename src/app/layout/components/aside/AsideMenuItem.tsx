import React from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG} from '../../../../_metronic/helpers'
import {useLayout} from '../../../../_metronic/layout/core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconName} from '@fortawesome/fontawesome-common-types'
import {Trans, useTranslation} from 'react-i18next'

type Props = {
    to: string
    title: string
    icon?: IconName
    fontIcon?: string
    hasBullet?: boolean
}

const AsideMenuItem: React.FC<Props> = ({
    children,
    to,
    title,
    icon,
    fontIcon,
    hasBullet = false,
}) => {
    const {pathname} = useLocation()
    const isActive = checkIsActive(pathname, to)
    const {config} = useLayout()
    const {aside} = config
    const {t} = useTranslation('translation')
    return (
        <div className='menu-item'>
            <Link className={clsx('menu-link without-sub', {active: isActive})} to={to}>
                {hasBullet && (
                    <span className='menu-bullet'>
                        <span className='bullet bullet-dot'></span>
                    </span>
                )}
                {icon && aside.menuIcon === 'svg' && (
                    // <i className='menu-icon fad fad-home'></i>
                    <span className='menu-icon'>
                        <span className='svg-icon svg-icon-2'>
                            <FontAwesomeIcon icon={['fad', icon]} />
                        </span>
                    </span>
                    // <span className='menu-icon'>
                    //     <KTSVG path={icon} className='svg-icon-2' />
                    // </span>
                )}
                {fontIcon && aside.menuIcon === 'font' && (
                    <i className={clsx('bi fs-3', fontIcon)}></i>
                )}
                <span className='menu-title'>
                    <Trans t={t}>{title}</Trans>
                </span>
            </Link>
            {children}
        </div>
    )
}

export {AsideMenuItem}
