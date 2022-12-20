/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {useTranslation} from 'react-i18next'
import {KTSVG} from '../../../../_metronic/helpers'
import {AsideMenuItem} from './AsideMenuItem'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'

import MainMenuConfig, {MenuItemConfig} from '../../../MainMenuConfig'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faEdit,
    faGlobeAsia,
    faHome,
    faInbox,
    faTrash,
    faTruck,
    faUserCog,
    faUserTie,
} from '@fortawesome/pro-duotone-svg-icons'

library.add(faEdit, faGlobeAsia, faHome, faInbox, faTrash, faTruck, faUserCog, faUserTie)

export function AsideMenuMain() {
    const intl = useIntl()
    const {t} = useTranslation('translation')

    function generateMenu(items: Array<MenuItemConfig>, hasBullet: boolean) {
        return items.map((item, index) => {
            if (item.children && item.children.length)
                return (
                    <AsideMenuItemWithSub
                        to={item.route}
                        icon={item.icon}
                        title={item.title}
                        hasBullet={hasBullet}
                        key={index}
                    >
                        <>{generateMenu(item.children, true)}</>
                    </AsideMenuItemWithSub>
                )
            else return <AsideMenuItem to={item.route} icon={item.icon} title={item.title} hasBullet={hasBullet} key={index} />
        })
    }

    return <>{generateMenu(MainMenuConfig, false)}</>
}
