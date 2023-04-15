function rInt(a,b) {
    return Math.floor(Math.random() * (b+1-a)) + a
}
function rChoice(list) {
    return list[Math.floor(Math.random() * list.length)];
}


function genRandomID(length=16) {
    let result = rChoice(["Red","Orange","Yellow","Green","Blue","Purple","White","Grey","Black","Scarlet","Cyan","Magenta","Pink","Indigo","Violet"])
    result += `-${rInt(10,99)}-`
    for(let i = 0; i < length; i++) {
        result += String.fromCharCode(rChoice([rInt(48,57),rInt(65,90),rInt(97,122)]))
    }
    return result 
}

initFromDB().then(() => main())

function main() {
    for(let i = 0; i < 8; i++) {
        console.log(genRandomID())
    }
}