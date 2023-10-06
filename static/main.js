function height(element) {
    return 124
}

function sortedKeys(p_saveState) {
    const arr = Object.keys(p_saveState).sort((s, t) => {
        if (p_saveState[s].pinned && !p_saveState[t].pinned) return -1
        if (!p_saveState[s].pinned && p_saveState[t].pinned) return 1
        return p_saveState[t].level - p_saveState[s].level
    })
    return arr
}

const textColor = [undefined, '#555', '#532', '#050', '#055', '#007', '#440', '#630', '#700', '#000', '#fff']
const background = [undefined, '#ddd', '#fda', '#cfb', '#9ff', '#bbf', '#ff9', '#fb7', '#f99', '#f66', '#000']

function modifySvg(svg, state, level) {
    if (state) svg.innerHTML = `
    <svg fill="none" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xml:space="preserve">
    <circle cx="10" cy="10" r="9" stroke="${textColor[level]}" stroke-width="2"></circle>
    <circle fill="${textColor[level]}" cx="10" cy="10" r="5"></circle>
    </svg>
    `
    else svg.innerHTML = `
    <svg fill="none" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xml:space="preserve">
    <circle cx="10" cy="10" r="8.5" stroke="${textColor[level]}8" stroke-width="3"></circle>
    </svg>
    `
}

let saveState = JSON.parse(localStorage.getItem('saveState') ?? '{}')
let elementMap = new Object()

function updaterBuilder(p_saveState, p_elementMap, l_i, l_key) {
    return () => {
        p_saveState[l_key].level = l_i
        let count = 1
        for (i_circle of p_elementMap[l_key].getElementsByClassName('circle')) {
            modifySvg(i_circle, count <= l_i, l_i)
            count++
        }
        rerender(p_saveState, p_elementMap)
    }
}

function pinBuilder(p_saveState, p_elementMap, l_key) {
    return () => {
        p_saveState[l_key].pinned = !p_saveState[l_key].pinned
        rerender(p_saveState, p_elementMap)
    }
}

function deleteBuilder(p_saveState, p_elementMap, l_key) {
    return () => {
        delete p_saveState[l_key]
        rerender(p_saveState, p_elementMap)
    }
}

function newProgress(p_saveState, p_elementMap, p_key) {
    const progress = document.createElement('div')
    if (!(p_key in p_saveState)) {
        p_saveState[p_key] = {
            level: 1,
            pinned: false
        }
    }
    for (let i=1; i<=10; i++) {
        const circle = document.createElement('div')
        circle.classList.add('circle')
        circle.onclick = updaterBuilder(p_saveState, p_elementMap, i, p_key)
        modifySvg(circle, i <= p_saveState[p_key].level, p_saveState[p_key].level)
        progress.append(circle)
    }
    const newDiv = document.createElement('div')
    newDiv.classList.add('thumbnail')
    let display_name = p_key
    if (p_key.length > 14) display_name = p_key.slice(0, 11) + '...'
    newDiv.innerHTML = `
    <div class="thumbnail-title">
    <h3 title="${p_key}">${display_name}</h3>
    <span>
    <h3 class="pin">📌</h3>
    <h3 class="delete">🗑️</h3>
    </span>
    </div>
    `
    newDiv.getElementsByClassName('pin')[0].onclick = pinBuilder(p_saveState, p_elementMap, p_key)
    newDiv.getElementsByClassName('delete')[0].onclick = deleteBuilder(p_saveState, p_elementMap, p_key)
    newDiv.append(progress)
    p_elementMap[p_key] = newDiv
    return newDiv
}

function initRender(p_saveState, p_elementMap) {
    const left = document.getElementById('left')
    const input = left.getElementsByTagName('input')[0]
    input.onkeydown = e => {
        if (e.key == 'Enter' && input.value && !(input.value in p_saveState)) {
            const newDiv = newProgress(p_saveState, p_elementMap, input.value)
            input.value = ''
            left.append(newDiv)
            rerender(p_saveState, p_elementMap)
        }
    }
    input.onblur = () => {
        input.value = ''
    }
    let pos = 0
    for (key of sortedKeys(p_saveState)) {
        const newDiv = newProgress(p_saveState, p_elementMap, key)
        newDiv.style.transform = `translateY(${pos}px)`
        newDiv.style.backgroundColor = background[p_saveState[key].level]
        newDiv.style.color = textColor[p_saveState[key].level]
        newDiv.style.borderColor = textColor[p_saveState[key].level]
        newDiv.getElementsByClassName('pin')[0].style.opacity = p_saveState[key].pinned ? 1 : 0.5
        pos += height(newDiv)
        newDiv.style.transitionDuration = '0.5s'
        left.append(newDiv)
    }
}

function rerender(p_saveState, p_elementMap) {
    let pos = 0
    for (key in p_saveState) {
        if (!(key in p_elementMap)) {
            const newDiv = newProgress(p_saveState, p_elementMap, key)
            left.append(newDiv)
        }
    }
    for (key in p_elementMap) {
        if (!(key in p_saveState)) {
            p_elementMap[key].remove()
            delete p_elementMap[key]
        }
    }
    for (key of sortedKeys(p_saveState)) {
        p_elementMap[key].style.transform = `translateY(${pos}px)`
        p_elementMap[key].style.backgroundColor = background[p_saveState[key].level]
        p_elementMap[key].style.color = textColor[p_saveState[key].level]
        p_elementMap[key].style.borderColor = textColor[p_saveState[key].level]
        p_elementMap[key].getElementsByClassName('pin')[0].style.opacity = p_saveState[key].pinned ? 1 : 0.5
        pos += height(p_elementMap[key])
        p_elementMap[key].style.transitionDuration = '0.5s'
    }
    localStorage.setItem('saveState', JSON.stringify(p_saveState))
}

const thumbnails = document.getElementsByClassName('thumbnail')

initRender(saveState, elementMap)
