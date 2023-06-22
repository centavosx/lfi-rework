import { FileTypes, RequiredFiles } from 'constant'

export function getFileTypeEnum(file: string): FileTypes | undefined {
  switch (file) {
    case 'idPic':
      return FileTypes.ID_PIC
    case 'ncae':
      return FileTypes.NCAE
    case 'certificate':
      return FileTypes.CERT
    case 'pantawid':
      return FileTypes.PANTAWID
    case 'gradeSlip':
      return FileTypes.GRADE_SLIP
    case 'birthCert':
      return FileTypes.BIRTH_CERT
    case 'autobiography':
      return FileTypes.BIO
    case 'homeSketch':
      return FileTypes.HOME_SKETCH
    case 'waterBill':
      return FileTypes.WATER_BILL
    case 'electricBill':
      return FileTypes.ELECTRIC_BILL
    case 'wifiBill':
      return FileTypes.WIFI_BILL
    case 'enrollmentBill':
      return FileTypes.ENROLLMENT_BILL
    case 'homeVisitProof':
      return FileTypes.HOME_VISIT_PROOF
    default:
      return undefined
  }
}

export const enumToFileName = (
  value: FileTypes
): keyof RequiredFiles | undefined => {
  switch (value) {
    case FileTypes.ID_PIC:
      return 'idPic'
    case FileTypes.NCAE:
      return 'ncae'
    case FileTypes.CERT:
      return 'certificate'
    case FileTypes.PANTAWID:
      return 'pantawid'
    case FileTypes.GRADE_SLIP:
      return 'gradeSlip'
    case FileTypes.BIRTH_CERT:
      return 'birthCert'
    case FileTypes.BIO:
      return 'autobiography'
    case FileTypes.HOME_SKETCH:
      return 'homeSketch'
    case FileTypes.HOME_SKETCH:
      return 'homeSketch'
    case FileTypes.ELECTRIC_BILL:
      return 'electricBill'
    case FileTypes.WIFI_BILL:
      return 'wifiBill'
    case FileTypes.ENROLLMENT_BILL:
      return 'enrollmentBill'
    case FileTypes.HOME_VISIT_PROOF:
      return 'homeVisitProof'
    default:
      return undefined
  }
}
