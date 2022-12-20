import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type { RootState } from '../setup/redux/RootReducer'
import type { AppDispatch } from '../setup/redux/Store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
