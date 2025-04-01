console.log("Entered to Connector...")

var allElements = document.getElementsByTagName("*")
for (var i = 0; i < allElements.length; i++) {
    var attrKeys = allElements[i].getAttributeNames()
    if (!attrKeys.includes("cb-elementid")) {
        allElements[i].setAttribute("cb-elementid", generateUniqueClass())
    }
}

function generateUniqueClass() {
    var length = 10
    var result = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return `CBID_${result}${new Date().getTime()}`
}
