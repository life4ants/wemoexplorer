// Reassignable runtime globals — use setters so all importers see updates via live bindings
// Setters also update window.* for .vue file compatibility (httpVueLoader can't use ES imports)

export let man = null
export let board = null
export let backpack = null
export let toolbelt = null
export let active = null
export let msgs = null

export function setMan(v) { man = v; window.man = v }
export function setBoard(v) { board = v; window.board = v }
export function setBackpack(v) { backpack = v; window.backpack = v }
export function setToolbelt(v) { toolbelt = v; window.toolbelt = v }
export function setActive(v) { active = v; window.active = v }
export function setMsgs(v) { msgs = v; window.msgs = v }

// Mutable-but-not-reassigned objects — properties change, reference stays the same
export const tiles = {}
export const gameBoards = []

export const world = {
  topOffset: 0,
  leftOffset: 0,
  frameRate: 12,
  noNight: false,
  growtime: 360,
  nearMan: []
  // resize() is attached in main.js to avoid circular deps (needs game + topbarHeight)
}
