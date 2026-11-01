export interface Quad { p0: [number, number]; c: [number, number]; p1: [number, number] }

export function crv(ax: number, ay: number, bx: number, by: number, lift: number): Quad {
  const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay
  const d = Math.hypot(dx, dy) || 1
  const off = Math.min(44, d * 0.18) * lift
  return { p0: [ax, ay], c: [mx + (-dy / d) * off, my + (dx / d) * off], p1: [bx, by] }
}
export const qd = (q: Quad) => `M${q.p0[0].toFixed(1)},${q.p0[1].toFixed(1)} Q${q.c[0].toFixed(1)},${q.c[1].toFixed(1)} ${q.p1[0].toFixed(1)},${q.p1[1].toFixed(1)}`
export function qpt(q: Quad, t: number): [number, number] {
  const u = 1 - t
  return [u * u * q.p0[0] + 2 * u * t * q.c[0] + t * t * q.p1[0], u * u * q.p0[1] + 2 * u * t * q.c[1] + t * t * q.p1[1]]
}
/** Curve between two icon centres, shortened so arrowheads stop at the icon edge. */
export function trim(a: { x: number; y: number }, b: { x: number; y: number }, lift: number): Quad {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d
  return crv(a.x + ux * 26, a.y + uy * 26, b.x - ux * 32, b.y - uy * 32, lift)
}
