import { v4 as uuidv4 } from 'uuid'

export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('drm_device_id')
  if (!id) {
    id = uuidv4()
    localStorage.setItem('drm_device_id', id)
  }
  return id
}
