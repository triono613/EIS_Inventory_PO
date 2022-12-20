import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'

interface SearchTextBoxProps {
    onChange: (value: string) => void
}

export function SearchTextBox(props: SearchTextBoxProps) {
    const [searchText, setSearchText] = useState('')
    const {t} = useTranslation('translation')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        console.log('Changed: Value = ' + event.target.value)
    }

    const handleKeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed!')
            triggerChange(searchText)
        }
    }

    const handleClearClick = () => {
        setSearchText('')
        console.log('Clear clicked')
        triggerChange('')
    }

    const handleSearchClick = () => {
        console.log('Search clicked')
        triggerChange(searchText)
    }

    function triggerChange(value: string) {
        if (props.onChange) props.onChange(value)
    }

    return (
        <span className='k-textbox k-grid-search k-display-flex w-250px'>
            <input
                id='searchText'
                value={searchText || ''}
                autoComplete='off'
                placeholder={t('Search') + '..'}
                title={t('Search') + '..'}
                className='k-input'
                onChange={handleChange}
                onKeyPress={handleKeypress}
            />
            {searchText && (
                <span className='k-input-icon clear-search'>
                    <a className='fa fa-times' onClick={handleClearClick} href='#'></a>
                </span>
            )}
            <span className='k-input-icon pe-auto'>
                <a className='fa fa-search' onClick={handleSearchClick} href='#'></a>
            </span>
        </span>
    )
}
