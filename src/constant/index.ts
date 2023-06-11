import { Level, ShsTrackAndStrandsEnum, CollegeEnum } from './types'
import { Option } from 'components/select'

export const Levels = {
  [Level.SHS]: 'Senior High School',
  [Level.COLLEGE]: 'College',
}
//  {
//     label: 'Accountancy, Business and Management Strand',
//     value: 'ABM',
//   },
//   {
//     label: 'Science, Technology, Engineering, and Mathematics (STEM)',
//     value: 'STEM',
//   },
//   { label: 'Humanities and Social Science (HUMSS)', value: 'HUMSS' },
//   { label: 'General Academic Strand', value: 'GAS' },
//   { label: 'Arts and Design', value: 'ART' },
//   { label: 'Sports', value: 'SPORTS' },
//   { label: 'TVL Track: Agricultural-Fishery Arts (AFA)', value: 'AFA' },
//   { label: 'TVL Track: Home Economics', value: 'HE' },
//   { label: 'TVL Track: Industrial Arts', value: 'IA' },
//   {
//     label: 'TVL Track: Information and Communications Technology (ICT)',
//     value: 'ICT',
//   },

export const ShsTrackAndStrands = {
  [ShsTrackAndStrandsEnum.ABM]: 'Accountancy, Business and Management Strand',
  [ShsTrackAndStrandsEnum.STEM]:
    'Science, Technology, Engineering, and Mathematics',
  [ShsTrackAndStrandsEnum.HUMSS]: 'Humanities and Social Science',
  [ShsTrackAndStrandsEnum.GAS]: 'General Academic Strand',
  [ShsTrackAndStrandsEnum.ART]: 'Art and Design',
  [ShsTrackAndStrandsEnum.SPORTS]: 'Sports',
  [ShsTrackAndStrandsEnum.AFA]: 'TVL Track: Agricultural-Fishery Arts',
  [ShsTrackAndStrandsEnum.HE]: 'TVL Track: Home Economics',
  [ShsTrackAndStrandsEnum.IA]: 'TVL Track: Industrial Arts',
  [ShsTrackAndStrandsEnum.ICT]:
    'TVL Track: Information and Communications Technology',
}

export const CollegeCourses = {
  [CollegeEnum.ABHist]: 'Bachelor of Arts in History',
  [CollegeEnum.ABPhilo]: 'Bachelor of Arts in Philosophy',
  [CollegeEnum.BFAIndusDesign]:
    'Bachelor of Fine Arts Major in Industrial Design',
  [CollegeEnum.BFAPaint]: 'Bachelor of Fine Arts Major in Painting',
  [CollegeEnum.BFASculpture]: 'Bachelor of Fine Arts Major in Sculpture',
  [CollegeEnum.BFAVisualComm]:
    'Bachelor of Fine Arts Major in Visual Communication',
  [CollegeEnum.ABEcon]: 'Bachelor of Arts in Economics',
  [CollegeEnum.BSEcon]: 'Bachelor of Science in Economics',
  [CollegeEnum.ABPsych]: 'Bachelor of Arts in Psychology',
  [CollegeEnum.BSPolSci]:
    'Bachelor of Science in Psychology (BS Political Science)',
  [CollegeEnum.BSCrim]: 'Bachelor of Science in Criminology',
  [CollegeEnum.ABPolSci]: 'Bachelor of Arts in Political Science',
  [CollegeEnum.ABEng]: 'Bachelor of Arts in English',
  [CollegeEnum.ABLinguis]: 'Bachelor of Arts in Linguistics',
  [CollegeEnum.ABLit]: 'Bachelor of Arts in Literature',
  [CollegeEnum.ABAnthro]: 'Bachelor of Arts in Anthropology',
  [CollegeEnum.ABSocio]: 'Bachelor of Arts in Sociology',
  [CollegeEnum.ABFil]: 'Bachelor of Arts in Filipino',
  [CollegeEnum.BSForeSci]: 'Bachelor of Science in Forensic Science',
  [CollegeEnum.ABIslamStudy]: 'Bachelor of Arts in Islamic Studies',
  [CollegeEnum.BSEnvSci]: 'Bachelor of Science in Environmental Science',
  [CollegeEnum.BSForest]: 'Bachelor of Science in Forestry',
  [CollegeEnum.BSFish]: 'Bachelor of Science in Fisheries',
  [CollegeEnum.BSGeo]: 'Bachelor of Science in Geology',
  [CollegeEnum.BSBio]: 'Bachelor of Science in Biology',
  [CollegeEnum.BSMoleBio]: 'Bachelor of Science in Molecular Biology',
  [CollegeEnum.BSPhysics]: 'Bachelor of Science in Physics',
  [CollegeEnum.BSAppPhysics]: 'Bachelor of Science in Applied Physics',
  [CollegeEnum.BSChem]: 'Bachelor of Science in Chemistry',
  [CollegeEnum.BSInfoTech]: 'Bachelor of Science in Information Technology',
  [CollegeEnum.BSCompSci]: 'Bachelor of Science in Computer Science',
  [CollegeEnum.BSInfoSys]: 'Bachelor of Science in Information Systems',
  [CollegeEnum.BSMath]: 'Bachelor of Science in Mathematics',
  [CollegeEnum.BSAppMath]: 'Bachelor of Science in Applied Mathematics',
  [CollegeEnum.BSStats]: 'Bachelor of Science in Statistics',
  [CollegeEnum.BSAgri]: 'Bachelor of Science in Agriculture',
  [CollegeEnum.BSAgriBus]: 'Bachelor of Science in Agribusiness',
  [CollegeEnum.BSAgroForest]: 'Bachelor of Science in Agroforestry',
  [CollegeEnum.BSArchi]: 'Bachelor in Science in Architecture',
  [CollegeEnum.BLandArchi]: 'Bachelor in Landscape Architecture',
  [CollegeEnum.BSIntDes]: 'Bachelor of Science in Interior Design',
  [CollegeEnum.BSAcc]: 'Bachelor of Science in Accountancy',
  [CollegeEnum.BSAccTech]: 'Bachelor of Science in Accounting Technology',
  [CollegeEnum.BSBusAd]: 'Bachelor of Science in Business Administration',
  [CollegeEnum.BSBusAdMajBusEcon]:
    'Bachelor of Science in Business Administration Major in Business Economics',
  [CollegeEnum.BSBusAdMajFinMan]:
    'Bachelor of Science in Business Administration Major in Financial Management',
  [CollegeEnum.BSBusAdMajHRDev]:
    'Bachelor of Science in Business Administration Major in Human Resource Development',
  [CollegeEnum.BSBusAdMajMarMan]:
    'Bachelor of Science in Business Administration Major in Marketing Management',
  [CollegeEnum.BSBusAdMajOpMan]:
    'Bachelor of Science in Business Administration Major in Operations Management',
  [CollegeEnum.BSHRM]: 'Bachelor of Science in Hotel and Restaurant Management',
  [CollegeEnum.BSEntrep]: 'Bachelor of Science in Entrepreneurship',
  [CollegeEnum.BSOffAdmin]: 'Bachelor of Science in Office Administration',
  [CollegeEnum.BSRealEstatMan]: 'Bachelor of Science in Real Estate Management',
  [CollegeEnum.BSTourism]: 'Bachelor of Science in Tourism Management',
  [CollegeEnum.BSMedTech]: 'Bachelor of Science in Medical Technology',
  [CollegeEnum.BSMidwifery]: 'Bachelor of Science in Midwifery',
  [CollegeEnum.BSNurse]: 'Bachelor of Science in Nursing',
  [CollegeEnum.BSOccupTherapy]: 'Bachelor of Science in Occupational Therapy',
  [CollegeEnum.BSPharma]: 'Bachelor of Science in Pharmacy',
  [CollegeEnum.BSRadTech]: 'Bachelor of Science in Radiologic Technology',
  [CollegeEnum.BSPhysThe]: 'Bachelor of Science in Physical Therapy',
  [CollegeEnum.BSResThe]: 'Bachelor of Science in Respiratory Therapy',
  [CollegeEnum.BSSpeechLang]:
    'Bachelor of Science in Speech-Language Pathology',
  [CollegeEnum.BSSporSci]: 'Bachelor of Science in Sports Science',
  [CollegeEnum.BSecondEd]: 'Bachelor in Secondary Education',
  [CollegeEnum.BElemEd]: 'Bachelor in Elementary Education',
  [CollegeEnum.BLibInfoSciPhil]:
    'Bachelor of Library and Information Science in the Philippines',
  [CollegeEnum.BPhysicalEduc]: 'Bachelor of Physical Education',
  [CollegeEnum.BSAeroEng]: 'Bachelor of Science in Aeronautical Engineering',
  [CollegeEnum.BSCerEng]: 'Bachelor of Science in Ceramic Engineering',
  [CollegeEnum.BSChemEng]: 'Bachelor of Science in Chemical Engineering',
  [CollegeEnum.BSCivEng]: 'Bachelor of Science in Civil Engineering',
  [CollegeEnum.BSCompEng]: 'Bachelor of Science in Computer Engineering',
  [CollegeEnum.BSElecEng]: 'Bachelor of Science in Electrical Engineering',
  [CollegeEnum.BSECEng]:
    'Bachelor of Science in Electronics and Communications Engineering',
  [CollegeEnum.BSGeoEng]: 'Bachelor of Science in Geodetic Engineering',
  [CollegeEnum.BSGeoloEng]: 'Bachelor of Science in Geological Engineering',
  [CollegeEnum.BSIndusEng]: 'Bachelor of Science in Industrial Engineering',
  [CollegeEnum.BSMarEng]: 'Bachelor of Science in Marine Engineering',
  [CollegeEnum.BSMatEng]: 'Bachelor of Science in Materials Engineering',
  [CollegeEnum.BSMechEng]: 'Bachelor of Science in Mechanical Engineering',
  [CollegeEnum.BSMetE]: 'Bachelor of Science in Metallurgical Engineering',
  [CollegeEnum.BSMinEng]: 'Bachelor of Science in Mining Engineering',
  [CollegeEnum.BSPetE]: 'Bachelor of Science in Petroleum Engineering',
}

export const DISPLAY_FILES = [
  { name: 'idPic', title: '2x2 ID Picture' },
  {
    name: 'ncae',
    title: 'Photocopy of National Career Assessment Examination (NCAE) ',
  },
  { name: 'certificate', title: 'Certificate of Indigency' },
  { name: 'pantawid', title: 'Photocopy of Pantawid ID' },
  { name: 'gradeSlip', title: 'Grade Slip' },
  { name: 'birthCert', title: 'Photocopy of PSA Birth Certificate ' },
  { name: 'autobiography', title: 'Autobiography' },
  { name: 'homeSketch', title: 'Sketch of Home Address' },
  { name: 'waterBill', title: 'Water Bill' },
  { name: 'electricBill', title: 'Electric Bill' },
  { name: 'wifiBill', title: 'Wifi Bill' },
  { name: 'enrollmentBill', title: 'Enrollment Bill' },
]

export const SCHOOL_LEVEL: Option<string, Level>[] = [
  {
    label: Levels[Level.SHS],
    value: Level.SHS,
  },
  {
    label: Levels[Level.COLLEGE],
    value: Level.COLLEGE,
  },
]

export const SHS_PROGRAMS: Option<string, ShsTrackAndStrandsEnum | null>[] = [
  ...Object.keys(ShsTrackAndStrands).map((v) => {
    return {
      label: ShsTrackAndStrands[v as keyof typeof ShsTrackAndStrands],
      value: v as ShsTrackAndStrandsEnum,
    }
  }),
  { label: 'Others', value: null },
]

export const COLLEGE_PROGRAMS: Option<string, CollegeEnum | null>[] = [
  ...Object.keys(CollegeCourses).map((v) => {
    return {
      label: CollegeCourses[v as keyof typeof CollegeCourses],
      value: v as CollegeEnum,
    }
  }),
]

export * from './types'
