var cronyScript = document.createElement("SCRIPT")
cronyScript.src = "https://cdn.socket.io/4.4.1/socket.io.min.js"
cronyScript.type = "text/javascript"
cronyScript["cb-elementid"] = generateUniqueClass()
document.getElementsByTagName("HEAD")[0].appendChild(cronyScript)

// globle window funtion can be accessed from anywhere in the browser
var socket
var queue = []
var sendDataFlag = true
var sequenceNumber

window.cronyWidget = function (customConfig) {
    var { token, apiServer } = customConfig

    // var socket = io("http://localhost:3000");
    // var roomName = "SqFR5uoLEUX8Qzuo66xF686qxf23";

    var roomName = token
    socket = io(apiServer)
    sequenceNumber = 0

    console.log("crony script initiated.....")

    socket.on("connect", () => {
        // instruct a room name to be joined by server
        socket.emit("new-user", roomName)

        rrweb.record({
            emit(event) {
                // console.log("rrweb host events: ", event)
                formatEventData(event)
                if (sendDataFlag) {
                    for (let i = 0; i < queue.length; i++) {
                        if (queue[i].type == 3 && queue[i].data.adds && queue[i].data.adds.length > 0) {
                            // console.log("queue :", queue[i])
                        }
                        socket.emit("send-event", { event: queue[i], room: roomName })
                    }
                    queue = []
                }
            },
            userTriggeredOnInput: true
        })
    })
}

function formatEventData(eventData) {
    // console.log("entered format data", eventData)
    ++sequenceNumber
    eventData["DOMHeight"] = document.body.clientHeight
    eventData["DOMWidth"] = document.body.clientWidth
    eventData["seq_no"] = sequenceNumber
    eventData["allow_callback"] = false

    if (eventData.type == 3 && eventData.data.source == 0) {
        console.log("adds data : .............................................\n", eventData.data)
        if (eventData.data.adds.length > 0) {
            for (let i = 0; i < eventData.data.adds.length; i++) {
                // eventData.data.adds[i].node = addHIDToTags([eventData.data.adds[i].node])[0]
                eventData.data.adds[i].node = addHIDToObj([eventData.data.adds[i].node])[0]
            }
            var addClasses = addClass()
            if (addClasses) {
                sendDataFlag = false
            }
            // console.log("eventData", eventData)
        }

        if (eventData.data.attributes.length > 0) {
            for (let i = 0; i < eventData.data.attributes.length; i++) {
                if (eventData.data.attributes[i].attributes["cb-elementid"]) {
                    document.querySelector(`[cb-elementid=${eventData.data.attributes[i].attributes["cb-elementid"]}]`).setAttribute("cb-hostid", eventData.data.attributes[i].id)
                    sendDataFlag = true
                } else if (eventData.data.attributes[i].attributes["cb-hostid"]) {
                    sendDataFlag = true
                }
            }
        }
    } else {
        if (eventData.type == 2) {
            eventData.data.node.childNodes = addHIDToTags(eventData.data.node.childNodes)
        }
    }
    queue.push(eventData)
}

function formatAddsData(addsArr) {
    // console.log("before: ", addsArr)
    for (let i = 0; i < addsArr.length; i++) {
        var findId = addsArr[i].node.id
        var filterData = addsArr.filter((obj) => obj.node.id != findId)
        var flag = findDataFromObj(filterData, findId)
        if (flag) {
            addsArr.splice(i, 1)
        }
    }
    // console.log("after: ", addsArr)
    return addsArr
}

function findDataFromObj(findData, findId) {
    for (let i = 0; i < findData.length; i++) {
        if (findData[i].id == findId) {
            return true
        }

        if (findData[i].childNodes && findData[i].childNodes.length > 0) {
            var flag = findDataFromObj(findData[i].childNodes, findId)
            return flag
        }

        if (i == findData.length - 1) {
            return false
        }
    }
}

function addClass() {
    var count = 0
    var allElements = document.getElementsByTagName("*")
    for (var i = 0; i < allElements.length; i++) {
        var attrKeys = allElements[i].getAttributeNames()
        if (!attrKeys.includes("cb-elementid")) {
            allElements[i].setAttribute("cb-elementid", generateUniqueClass())
            // if (attrKeys.includes("cb-tempid")) {
            //     allElements[i].removeAttribute("cb-tempid")
            // }
            count++
        }
    }

    if (count > 0) {
        return true
    } else {
        return false
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

function addHIDToTags(childNodes) {
    var childNodes = JSON.parse(JSON.stringify(childNodes))
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type == 2) {
            var attrKeys = Object.keys(childNodes[i].attributes)
            if (!attrKeys.includes("cb-hostid") && attrKeys.includes("cb-elementid")) {
                childNodes[i].attributes["cb-hostid"] = childNodes[i].id
                document.querySelector(`[cb-elementid=${childNodes[i].attributes["cb-elementid"]}]`).setAttribute("cb-hostid", childNodes[i].id)
                if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                    childNodes[i].childNodes = addHIDToTags(childNodes[i].childNodes)
                }
            }
        }
    }
    return childNodes
}

function addHIDToObj(childNodes) {
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type == 2) {
            childNodes[i].attributes["cb-hostid"] = childNodes[i].id
            // document.querySelector(`[cb-elementid=${childNodes[i].attributes["cb-elementid"]}]`).setAttribute("cb-hostid", childNodes[i].id)
            if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                childNodes[i].childNodes = addHIDToObj(childNodes[i].childNodes)
            }
        }
    }
    return childNodes
}
