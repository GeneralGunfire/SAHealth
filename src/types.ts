export type SectorId = 'public' | 'other' | 'shared' | 'private' | 'ngo'
export type LayerId =
  | 'standards' | 'integration' | 'money' | 'lab' | 'pharmacy' | 'emergency'
  | 'programme' | 'hospital' | 'phc' | 'registry' | 'identity'
export type IconName =
  | 'db' | 'person' | 'registry' | 'paper' | 'flask' | 'pill' | 'cross' | 'drop'
  | 'receipt' | 'hub' | 'braces' | 'image' | 'chart'
export type Lens = 'all' | 'identity' | 'clinical' | 'aggregate' | 'lab' | 'claims'
export type Confidence = 'confirmed' | 'likely' | 'uncertain'
export type Status = 'live' | 'beta' | 'legacy' | 'paper'
export type LinkType = 'live' | 'batch' | 'manual'

export interface SysNode {
  id: string
  name: string            // plain-language name
  alias?: string          // the technical or brand name
  layer: LayerId
  sector: SectorId
  icon: IconName
  core?: boolean          // shown in "Key systems"
  lens: Exclude<Lens, 'all'>[]
  provs?: string[]        // province-specific systems
  sim?: [string, 'R' | 'P'] // DEXA stand-in: [database, machine]
  status: Status
  conf: Confidence
  summary: string
  tech?: string
  who?: string
  holds?: string
  notHolds?: string
  scale?: string
  standards?: string
  why?: string            // why it stays disconnected
  src: string[]
}
export interface Edge { a: string; b: string; type: LinkType; what: string }
export interface JStep { f: string; t: string; k: LinkType | 'break'; h: string; p: string; lbl: string }
export interface Journey { id: string; g: 'public' | 'private' | 'cross'; title: string; intro: string; steps: JStep[] }
export interface Source { id: string; title: string; url: string }
export interface ProvinceInfo { hosp: string | null; phc: string; beta: number; dc: string | null; none: boolean; hprs: string; other?: string; src: string[] }
