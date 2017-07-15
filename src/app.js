import universes from './config.js'
import domify from 'domify';

const universesEl = document.querySelector('.universes')

for (const [index, universe] of universes.entries()) {
  const universeEl = domify(`<li class="universe" title="${universe.name}"></li>`)
  const rotation = (360 / universes.length * index) - 90
  universeEl.style.transform = `
    translate(-6.5vmin, -6.5vmin)
    rotate(${rotation}deg)
    translate(32vmin)
    rotate(${rotation * -1}deg)
  `
  universesEl.appendChild(universeEl)
}