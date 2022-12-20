import React, { Dispatch } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'
//import withReducer from '../../app/store/withReducer';
import {closeDialog, openDialog} from './AppDialogSlice'
import {useAppSelector, useAppDispatch} from '../../../hooks'
import {TFunction, useTranslation} from 'react-i18next'
import {Button} from '@progress/kendo-react-buttons'

function AppDialog() {
    const dispatch = useDispatch()
    const open = useAppSelector((state) => state.appDialog.open)
    const options = useAppSelector((state) => state.appDialog.options)

    function handleClose() {
        dispatch(closeDialog('test'))
    }

    return open ? (
        <Dialog onClose={handleClose} aria-labelledby='app-dialog-title' {...options}>
            {options.children}
            {options.buttons && (
                <DialogActionsBar layout={'center'}>{options.buttons}</DialogActionsBar>
            )}
        </Dialog>
    ) : (
        <></>
    )
}

function ShowDeleteConfirmation(
    dispatch: Dispatch<any>,
    t:TFunction<"translation">,
    objectType: string,
    objectName: string,
    handleDeleteConfirm: () => void
) {
    //const {t} = useTranslation('translation')
    //const dispatch = useDispatch()
    dispatch(
        openDialog({
            title: t('DeleteData', {data: objectType}),
            style: {minWidth: 300},
            children: (
                <React.Fragment>
                    <p className='p-10'>{t('AreYouSureWantToDeleteData', {data: objectName})}</p>
                </React.Fragment>
            ),
            buttons: (
                <React.Fragment>
                    <Button
                        onClick={() => handleDeleteConfirm()}
                        primary={true}
                        style={{minWidth: 100}}
                    >
                        {t('Yes')}
                    </Button>
                    <Button onClick={() => dispatch(closeDialog(null))} style={{minWidth: 80}}>
                        {t('Cancel')}
                    </Button>
                </React.Fragment>
            ),
        })
    )
}

export default AppDialog

export {ShowDeleteConfirmation}
//export default withReducer('dialog', reducer)(AppDialog);
