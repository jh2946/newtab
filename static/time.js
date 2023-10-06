const timeElm = document.getElementById('time')
const dateElm = document.getElementById('date')
const progressElm = document.getElementById('progress')
const milestoneElm1 = document.getElementById('milestone-1')
const milestoneElm2 = document.getElementById('milestone-2')

let startend = JSON.parse(localStorage.getItem('startend') ?? '["07:00", "22:00"]')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function pad(n, l) {
    const s = n.toString()
    return '0'.repeat(Math.max(0, l-s.length)) + s
}

function toTime(datetime) {
    return `${pad(datetime.getHours(), 2)}:${pad(datetime.getMinutes(), 2)}`
}

function duration(ms) {
    const sec = Math.floor(ms/1000 % 60)
    const min = Math.floor(ms/60000 % 60)
    const h = Math.floor(ms/3600000)
    let ans = 0
    if (sec || sec == min == h == 0) ans = `${sec}sec ` + ans
    if (min) ans = `${min}min ` + ans
    if (h) ans = `${h}h ` + ans
    return ans.slice(0, ans.length - 2)
}

setInterval(() => {
    const now = new Date()
    timeElm.innerText = toTime(now)
    dateElm.innerText = `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`
    const start = new Date(dateElm.innerText + ' ' + startend[0])
    const end = new Date(dateElm.innerText + ' ' + startend[1])
    const ratio = (now - start)/(end - start) * 100
    const nextpercent = Math.ceil(ratio)
    const percenttime = new Date(nextpercent/100 * end + (1 - nextpercent/100) * start)
    const percentduration = duration(percenttime - now)
    const nexttenpercent = Math.ceil((ratio + 1) / 10) * 10
    const tenpercenttime = new Date(nexttenpercent/100 * end + (1 - nexttenpercent/100) * start)
    const tenpercentduration = duration(tenpercenttime - now)
    if (ratio > 0 && ratio < 100) {
        progressElm.innerText = `${ratio.toFixed(3)}%`
        milestoneElm1.innerText = `${nextpercent}% at ${toTime(percenttime)} (${percentduration})`
        if (ratio < 99) milestoneElm2.innerText = `${nexttenpercent}% at ${toTime(tenpercenttime)} (${tenpercentduration})`
        else milestoneElm2.innerText = ''
    }
    else milestoneElm1.innerText = milestoneElm2.innerText = progressElm.innerText = ''
}, 30)
