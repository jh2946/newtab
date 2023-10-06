const quotesBtn = document.getElementById('quote-btn')
const quoteP = document.getElementById('quote')
const quotee = document.getElementById('quotee')

let quotes = JSON.parse(localStorage.getItem('quotes') ?? '[]')

quotesBtn.onclick = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)]
    const idx = newQuote.indexOf('--')
    if (idx == -1) {
        quoteP.innerText = newQuote
        quotee.innerText = ''
    }
    else {
        quoteP.innerText = newQuote.substr(0, idx)
        quotee.innerText = newQuote.substr(idx+1)
    }
}

quotesBtn.onblur = () => {
    quoteP.innerText = quotee.innerText = ''
}
