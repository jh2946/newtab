const btn = document.getElementById('setting-btn')
const layer = document.getElementById('layer-over')
const xbtn = document.getElementById('setting-x')
const startElm = document.getElementById('start')
const endElm = document.getElementById('end')
const quotesElm = document.getElementById('quote-box')

const tempArray = JSON.parse(localStorage.getItem('startend') ?? '["07:00", "22:00"]')
startElm.value = tempArray[0]
endElm.value = tempArray[1]
quotesElm.value = JSON.parse(localStorage.getItem('quotes') ?? '[""]').join('\n')

btn.onclick = () => layer.style.display = 'flex'
xbtn.onclick = () => layer.style.display = 'none'

startElm.oninput = endElm.oninput = () => {
    localStorage.setItem('startend', JSON.stringify(startend = [startElm.value, endElm.value]))
}

quotesElm.oninput = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes = quotesElm.value.split('\n').filter(s => s)))
}
