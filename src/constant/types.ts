export enum Level {
  SHS = 'SHS',
  COLLEGE = 'College',
}

export enum ShsTrackAndStrandsEnum {
  ABM = 'ABM',
  STEM = 'STEM',
  HUMSS = 'HUMSS',
  GAS = 'GAS',
  ART = 'ART',
  SPORTS = 'SPORTS',
  AFA = 'AFA',
  HE = 'HE',
  IA = 'IA',
  ICT = 'ICT',
}

export enum CollegeEnum {
  ABHist = 'AB History',
}

export type RequiredFiles = {
  idPic?: string
  ncae?: string
  certificate?: string
  pantawid?: string
  gradeSlip?: string
  birthCert?: string
  homeSketch?: string
  waterBill?: string
  electricBill?: string
  wifiBill?: string
  enrollmentSlip?: string
}

export type RegFormType = {
  fname: string
  mname?: string
  lname: string
  level?: Level
  address: string
  email: string
  program?: CollegeEnum | ShsTrackAndStrandsEnum | null
} & RequiredFiles
