import {S01, S02, S03, S04, S05, S06, SceneFC} from './A_intro_clinic';
import {S07, S08, S09, S10, S11} from './B_lab_hospital';
import {S12, S13, S14, S15, S16, S17} from './C_private_access';
import {S18, S19, S20, S21, S22, S23, S24, S25, S26} from './D_gaps';

export const SCENES: Record<string, SceneFC> = {
  s01_open: S01, s02_sectors: S02, s03_hprs: S03, s04_folder: S04, s05_dhis: S05, s06_tiernet: S06,
  s07_lab: S07, s08_meds: S08, s09_hospitals: S09, s10_phdc: S10, s11_ems: S11,
  s12_gp: S12, s13_claims: S13, s14_privlab: S14, s15_privhosp: S15, s16_access: S16, s17_rules: S17,
  s18_gaps_intro: S18, s19_norecord: S19, s20_identity: S20, s21_copying: S21, s22_paper: S22,
  s23_patchwork: S23, s24_wrongdata: S24, s25_wall: S25, s26_close: S26,
};
