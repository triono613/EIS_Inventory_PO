import {toAbsoluteUrl} from '../../../helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      {/* <img src={toAbsoluteUrl('/media/logos/tms-color-100.svg')} alt='Start logo' className='h-100px' /> */}
      <span>Loading ...</span>
    </div>
  )
}
