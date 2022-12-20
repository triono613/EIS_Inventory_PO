import { Calendar } from '@progress/kendo-react-dateinputs'
import {useTranslation} from 'react-i18next'


const TestPage = () => {
    const {t} = useTranslation('translation')
    return (
      <div>
        <div>{t('LocationTypes')}!</div>
        <Calendar />
      </div>
    )
};

export default TestPage;