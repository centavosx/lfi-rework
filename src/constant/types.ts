import { Roles, UserStatus } from 'entities'

export enum Level {
  SHS = 'SHS',
  COLLEGE = 'College',
}

export enum Education {
  first1stSem = '1st year - 1st Sem',
  first2ndSem = '1st year - 2nd Sem',
  first3rdSem = '1st year - 3rd Sem',
  firstSummer = '1st year - Summer',

  second1stSem = '2nd year - 1st Sem',
  second2ndSem = '2nd year - 2nd Sem',
  second3rdSem = '2nd year - 3rd Sem',
  secondSummer = '2nd year - Summer',

  third1stSem = '3rd year - 1st Sem',
  third2ndSem = '3rd year - 2nd Sem',
  third3rdSem = '3rd year - 3rd Sem',
  thirdSummer = '3rd year - Summer',

  fourth1stSem = '4th year - 1st Sem',
  fourth2ndSem = '4th year - 2nd Sem',
  fourth3rdSem = '4th year - 3rd Sem',
  fourthSummer = '4th year - Summer',

  fifth1stSem = '5th year - 1st Sem',
  fifth2ndSem = '5th year - 2nd Sem',
  fifth3rdSem = '5th year - 3rd Sem',
  fifthSummer = '5th year - Summer',

  sixth1stSem = '6th year - 1st Sem',
  sixth2ndSem = '6th year - 2nd Sem',
  sixth3rdSem = '6th year - 3rd Sem',
  sixthSummer = '6th year - Summer',
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

export type RequiredFiles = {
  idPic: string
  ncae: string
  certificate: string
  pantawid: string
  gradeSlip: string
  birthCert: string
  autobiography: string
  homeSketch: string
  waterBill?: string
  electricBill?: string
  wifiBill?: string
  enrollmentBill?: string
  homeVisitProof: string
}

export type UserDetails = {
  fname: string
  mname?: string
  lname: string
  email: string
  address: string
}

export type RegisterDto = UserDetails & {
  status: UserStatus
  role: Roles[]
  userData?: RequiredFiles & {
    level: string
    program: string
    education: string
    semester: number
  }
}

export type UserInfo = UserDetails & {
  level: string
  education: string
  semester: number
  program: string
}

export type RegFormType = {
  fname: string
  mname?: string
  lname: string
  level?: Level
  address: string
  email: string
  program?: string
  education?: string
  lastGwa?: number
} & Partial<RequiredFiles>

export enum CollegeEnum {
  ABHist = 'AB History',
  ABPhilo = 'AB Philosophy',
  BFAIndusDesign = 'BFA Industrial Design',
  BFAPaint = 'BFA Painting',
  BFASculpture = 'BFA Sculpture',
  BFAVisualComm = 'BFA Visual Communication',
  ABEcon = 'AB Economics',
  BSEcon = 'BS Economics',
  ABPsych = 'AB Psychology',
  BSPolSci = 'BS Political Science',
  BSCrim = 'BS Criminology',
  ABPolSci = 'AB Political Science',
  ABEng = 'AB English',
  ABLinguis = 'AB Linguistics',
  ABLit = 'AB Literature',
  ABAnthro = 'AB Anthropology',
  ABSocio = 'AB Sociology',
  ABFil = 'AB Filipino',
  BSForeSci = 'BS Forensic Science',
  ABIslamStudy = 'AB Islamic Studies',
  BSEnvSci = 'BS Environmental Science',
  BSForest = 'BS Forestry',
  BSFish = 'BS Fisheries',
  BSGeo = 'BS Geology',
  BSBio = 'BS Biology',
  BSMoleBio = 'BS Molecular Biology',
  BSPhysics = 'BS Physics',
  BSAppPhysics = 'BS Applied Physics',
  BSChem = 'BS Chemistry',
  BSInfoTech = 'BS Information Technology',
  BSCompSci = 'BS Computer Science',
  BSInfoSys = 'BS Information System',
  BSMath = 'BS Mathematics',
  BSAppMath = 'BS Applied Mathematics',
  BSStats = 'BS Statistics',
  BSAgri = 'BS Agriculture',
  BSAgriBus = 'BS Agri Business',
  BSAgroForest = 'BS Agroforestry',
  BSArchi = 'BS Architecture',
  BLandArchi = 'B Landscape Architecture',
  BSIntDes = 'BS Interior Design',
  BSAcc = 'BS Accountancy',
  BSAccTech = 'BS Accounting Technology',
  BSBusAd = 'BS Business Administration',
  BSBusAdMajBusEcon = 'BS Business Administration Major in Business Economics',
  BSBusAdMajFinMan = 'BS Business Administration Major in Financial Management',
  BSBusAdMajHRDev = 'BS Business Administration Major in Human Resource Development',
  BSBusAdMajMarMan = 'BS Business Administration Major in Marketing Management',
  BSBusAdMajOpMan = 'BS Business Administration Major in Operations Management',
  BSHRM = 'BS Hotel and Restaurant Management',
  BSEntrep = 'BS Entrpreneurship',
  BSOffAdmin = 'BS Office in Adminsitration',
  BSRealEstatMan = 'BS Real Estate Management',
  BSTourism = 'BS Tourism Management',
  BSMedTech = 'BS Medical Technology',
  BSMidwifery = 'BS Midwifery',
  BSNurse = 'BS Nursing',
  BSOccupTherapy = 'BS Occupational Therapy',
  BSPharma = 'BS Pharmacy',
  BSRadTech = 'BS Radiologic Technology',
  BSPhysThe = 'BS Physical Therapy',
  BSResThe = 'BS Respiratory Therapy',
  BSSpeechLang = 'BS Speech-Language Pathology',
  BSSporSci = 'BS Sports Science',
  BSecondEd = 'B Secondary Education',
  BElemEd = 'B Elementary Education',
  BLibInfoSciPhil = 'B Library and Information Science in the Philippines',
  BPhysicalEduc = 'B Physical Education',
  BSAeroEng = 'BS Aeronautical Engineering',
  BSCerEng = 'BS Ceramic Engineering',
  BSChemEng = 'BS Chemical Engineering',
  BSCivEng = 'BS Civil Engineering',
  BSCompEng = 'BS Computer Engineering',
  BSElecEng = 'BS Electrical Engineering',
  BSECEng = 'BS Electronics and Communications Engineering',
  BSGeoEng = 'BS Geodetic Engineering',
  BSGeoloEng = 'BS Geological Engineering',
  BSIndusEng = 'BS Industrial Engineering',
  BSMarEng = 'BS Marine Engineering',
  BSMatEng = 'BS Materials Engineering',
  BSMechEng = 'BS Mechanical Engineering',
  BSMetE = 'BS Metallurgical Engineering',
  BSMinEng = 'BS Mining Engineering',
  BSPetE = 'BS Petroleum Engineering',
}

export type EventDto<T extends any = Date> = {
  name: string
  description: string
  startDate: T
  endDate: T
  color?: string
}

export enum FileTypes {
  ID_PIC = 'ID_PICTURE',
  NCAE = 'NCAE',
  CERT = 'CERTIFICATE',
  PANTAWID = 'PANTAWID',
  GRADE_SLIP = 'GRADE_SLIP',
  BIRTH_CERT = 'BIRTH_CERTIFICATE',
  BIO = 'AUTOBIOGRAPHY',
  HOME_SKETCH = 'HOME_SKETCH',
  WATER_BILL = 'WATER_BILL',
  ELECTRIC_BILL = 'ELECTRIC_BILL',
  WIFI_BILL = 'WIFI_BILL',
  ENROLLMENT_BILL = 'ENROLLMENT_BILL',
  HOME_VISIT_PROOF = 'HOME_VISIT_PROOF',
}
