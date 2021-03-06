import defaultUniverses from './config.js'
import domify from 'domify'

import './service-worker.js'

let universes = getData()

const page1El = document.querySelector('.page.first')
const page2El = document.querySelector('.page.single')
const universesEl = document.querySelector('.universes')
const fightersEl = document.querySelector('.fighters')

let theUniverseIndex = 0

for (const [index, universe] of universes.entries()) {
  const universeEl = domify(`<li class="universe" data-universe="${index}" title="${universe.name}">${index+1}</li>`)
  const rotation = (360 / universes.length * index) - 90
  universeEl.style.transform = `
    translate(-7.5vmin, -7.5vmin)
    rotate(${rotation}deg)
    translate(29vmin)
    rotate(${rotation * -1}deg)
  `
  universesEl.appendChild(universeEl)
}

page1El.addEventListener('click', e => {
  if (!e.target.classList.contains('universe')) {
    return
  }
  page1El.style.display = 'none'
  page2El.style.display = 'flex'
  initSingle(parseInt(e.target.getAttribute('data-universe')))
})

function initSingle(universeIndex) {
  theUniverseIndex = universeIndex
  const universe = universes[universeIndex]
  fightersEl.innerHTML = ''
  for (const [index, fighter] of universe.fighters.entries()) {
    const removed = isFighterRemoved(universeIndex, index) ? 'removed' : ''
    const fighterEl = domify(`
          <li class="fighter ${removed}" data-fighter="${index}" title="${fighter.name}" style="background-image: url('/images/fighters/${universeIndex+1}-${index+1}.jpg')">
            <span class="spacer"></span>
            <span class="fighter-name">${fighter.name}</span>
          </li>
        `)
    fightersEl.appendChild(fighterEl)
  }
  page2El.querySelector('.universe-icon').textContent = universeIndex + 1
  page2El.querySelector('.universe-name').textContent = universe.name
}

page2El.addEventListener('click', e => {
  if (!e.target.matches('.fighter') && !e.target.parentNode.matches('.fighter')) {
    return
  }
  const fighterEl = e.target.matches('.fighter') ? e.target : e.target.parentNode
  if (fighterEl.classList.contains('removed')) {
    fighterEl.classList.remove('removed')
    addFighter(theUniverseIndex, fighterEl.getAttribute('data-fighter'))
  } else {
    fighterEl.classList.add('removed')
    removeFighter(theUniverseIndex, fighterEl.getAttribute('data-fighter'))
  }
})

function isFighterRemoved(universeIndex, fighterIndex) {
  if (universes[universeIndex].fighters[fighterIndex].removed === true) {
    return true
  }
  return false
}

function removeFighter(universeIndex, fighterIndex) {
  universes[universeIndex].fighters[fighterIndex].removed = true
  saveData()
}

function addFighter(universeIndex, fighterIndex) {
  universes[universeIndex].fighters[fighterIndex].removed = false
  saveData()
}

function getData() {
  if (localStorage.getItem('universes')) {
    return JSON.parse(localStorage.getItem('universes'))
  }
  return defaultUniverses
}

function saveData() {
  localStorage.setItem('universes', JSON.stringify(universes))
}