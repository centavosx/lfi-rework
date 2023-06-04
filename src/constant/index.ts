import { Level, ShsTrackAndStrandsEnum, CollegeEnum } from './types'

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
  { name: 'enrollmentSlip', title: 'Enrollment Bill' },
]

export * from './types'
