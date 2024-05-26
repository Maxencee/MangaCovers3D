export const $ = (el) => { return document.querySelector(el); }
export const $$ = (els) => { return document.querySelectorAll(els); }

export const Random = (min, max) => { return Math.floor(Math.random() * (max - min) + min); }