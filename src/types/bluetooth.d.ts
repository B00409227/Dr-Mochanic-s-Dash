// Web Bluetooth API type declarations
interface BluetoothDevice {
  id: string
  name?: string
  gatt?: BluetoothRemoteGATTServer
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice
  connected: boolean
  connect(): Promise<BluetoothRemoteGATTServer>
  disconnect(): void
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>
  getPrimaryServices(service?: string): Promise<BluetoothRemoteGATTService[]>
}

interface BluetoothRemoteGATTService {
  device: BluetoothDevice
  uuid: string
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>
  getCharacteristics(characteristic?: string): Promise<BluetoothRemoteGATTCharacteristic[]>
}

interface BluetoothRemoteGATTCharacteristic extends EventTarget {
  service: BluetoothRemoteGATTService
  uuid: string
  value?: DataView
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  readValue(): Promise<DataView>
  writeValue(value: BufferSource): Promise<void>
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[]
  acceptAllDevices?: boolean
  optionalServices?: string[]
}

interface BluetoothRequestDeviceFilter {
  services?: string[]
  name?: string
  namePrefix?: string
}

interface Bluetooth {
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>
  getAvailability(): Promise<boolean>
}

interface Navigator {
  bluetooth: Bluetooth
}
