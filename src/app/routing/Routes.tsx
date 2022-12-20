/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {FC} from 'react'
import {Redirect, Switch, Route} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {Toaster} from 'react-hot-toast'
import {MasterLayout} from '../layout/MasterLayout'
import {PrivateRoutes} from './PrivateRoutes'
import {Logout, AuthPage} from '../modules/auth'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {RootState} from '../../setup'
import AppDialog from '../shared/components/AppDialog/AppDialog'

const Routes: FC = () => {
    const isAuthorized = useSelector<RootState>(({auth}) => auth.user, shallowEqual)

    return (
        <Switch>
            {!isAuthorized ? (
                /*Render auth page when user at `/auth` and not authorized.*/
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                /*Otherwise redirect to root page (`/`)*/
                <Redirect from='/auth' to='/' />
            )}

            <Route path='/error' component={ErrorsPage} />
            <Route path='/logout' component={Logout} />

            {!isAuthorized ? (
                /*Redirect to `/auth` when user is not authorized*/
                <Redirect to='/auth/login' />
            ) : (
                <React.Fragment>
                    <Toaster
                        toastOptions={{
                            duration: 4000,
                            style: {
                                padding: '16px',
                                fontSize: '1.2em',
                            },
                            success: {
                                duration: 4000,
                            },
                        }}
                    />
                    {/* <div></div> */}
                    <AppDialog />
                    <MasterLayout>
                        <PrivateRoutes />
                    </MasterLayout>
                </React.Fragment>
            )}
        </Switch>
    )
}

export {Routes}
