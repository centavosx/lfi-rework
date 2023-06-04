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
