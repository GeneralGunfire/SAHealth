import { NODES } from '../data/nodes'
import { ICON_LABEL, SECTOR } from '../data/meta'
import { SRC } from '../data/meta'
import { CONF, journeysFor, neighbours } from './model'
import type { LayerId, Lens, SysNode } from '../types'

/** What each layer of the landscape means, in plain words. General definitions, not claims about South Africa. */
export const LAYER_DESC: Record<LayerId, string> = {
  identity: 'Systems that establish who a person is, so that records can be matched to them.',
  registry: 'Official registers of professionals, facilities and medical schemes that other systems rely on.',
  phc: 'Records kept where primary care happens: public clinics and private practices.',
  hospital: 'Records kept during hospital visits and admissions.',
  programme: 'Data kept for specific health programmes, such as HIV treatment or maternal care.',
  emergency: 'Records of ambulance, emergency and blood services.',
  pharmacy: 'Systems for stocking, ordering and dispensing medicines.',
  lab: 'Systems that handle tests and imaging, and return results to the clinician.',
  money: 'Claims, payment and scheme systems that fund care.',
  integration: 'Exchanges and brokers that move data between other systems.',
  standards: 'Shared code sets and formats that let different systems describe the same thing the same way.',
}

export const LENS_LABEL: Record<Exclude<Lens, 'all'>, string> = {
  identity: 'Identity', clinical: 'Clinical records', aggregate: 'Reporting totals', lab: 'Lab and imaging', claims: 'Claims and money',
}

/** The detail fields a system page can show, and whether each is documented. */
export function detailFields(n: SysNode) {
  return [
    { k: 'who', label: 'Who runs it', has: !!n.who },
    { k: 'holds', label: 'What it holds', has: !!n.holds },
    { k: 'notHolds', label: 'What it does not hold', has: !!n.notHolds },
    { k: 'scale', label: 'Scale and use', has: !!n.scale },
    { k: 'tech', label: 'How it works', has: !!n.tech },
    { k: 'standards', label: 'Standards', has: !!n.standards },
    { k: 'why', label: 'Why it stays disconnected', has: !!n.why },
  ]
}
export const detailDepth = (n: SysNode) => {
  const f = detailFields(n)
  return { have: f.filter((x) => x.has).length, total: f.length }
}

/** The short, scannable facts about a system. Only things that are in the data. */
export function factSheet(n: SysNode) {
  const links = neighbours(n.id)
  return [
    { label: 'Type', value: ICON_LABEL[n.icon] },
    { label: 'Run by', value: SECTOR[n.sector].name, hint: SECTOR[n.sector].sub },
    { label: 'Operator', value: n.who ?? 'Not documented' },
    { label: 'Kind of data', value: n.lens.map((l) => LENS_LABEL[l]).join(', ') },
    { label: 'Where it is used', value: n.provs?.length ? n.provs.join(', ') : 'Not tied to one province' },
    { label: 'Role on the map', value: n.core ? 'Key system' : 'Supporting system' },
    { label: 'Connections', value: links.length ? `${links.length} documented` : 'None documented' },
    { label: 'Journeys', value: `${journeysFor(n.id).length}` },
    { label: 'Sources', value: `${n.src.filter((s) => SRC[s]).length}` },
    { label: 'Evidence', value: CONF[n.conf].label, hint: CONF[n.conf].text },
  ]
}

/** Systems worth reading next: same layer first, then same sector. */
export function related(n: SysNode, limit = 6): SysNode[] {
  const direct = new Set(neighbours(n.id).map((x) => x.other.id))
  const pool = NODES.filter((m) => m.id !== n.id)
  const score = (m: SysNode) => (m.layer === n.layer ? 2 : 0) + (m.sector === n.sector ? 1 : 0) + (direct.has(m.id) ? 0 : 0.5)
  return pool.filter((m) => m.layer === n.layer || m.sector === n.sector).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name)).slice(0, limit)
}
