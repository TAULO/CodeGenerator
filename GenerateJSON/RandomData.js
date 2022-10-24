function rndStr() {
    const rndString = "abcdefghijklmnopqrstuvwz"

    let str = ""
    for (let i = 0; i < rndString.length; i++) {
        const rnd = Math.floor((Math.random() * rndString.length - 1) + 1)
        str += rndString[rnd]
    }  
    return str
}

module.exports = { rndStr }