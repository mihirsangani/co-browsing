var allEvents = [
    "onblur",
    "onchange",
    "oncontextmenu",
    "onfocus",
    "oninput",
    "oninvalid",
    "onreset",
    "onsearch",
    "onselect",
    "onsubmit",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onwheel",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onafterprint",
    "onbeforeprint",
    "onbeforeunload",
    "onerror",
    "onhashchange",
    "onload",
    "onmessage",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpopstate",
    "onresize",
    "onstorage",
    "onunload",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "onscroll",
    "oncopy",
    "oncut",
    "onpaste",
    "onabort",
    "oncanplay",
    "oncanplaythrough",
    "oncuechange",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onseeked",
    "onseeking",
    "onstalled",
    "onsuspend",
    "ontimeupdate",
    "onvolumechange",
    "onwaiting"
]
const { Server } = require("socket.io")
const { createServer } = require("http")

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})
var roomName = "SqFR5uoLEUX8Qzuo66xF686qxf23"

io.on("connection", (socket) => {
    socket.emit("hello", { greeting: "Hello User" })
    console.log("connected", socket.id)

    //join a room instructed by client
    socket.on("new-user", function (room) {
        console.log(room + " created...")
        socket.join(room)
    })

    //emit recevied message to specified room
    socket.on("send-event", function (data) {
        console.log("message from user in room... " + data.room)

        if (data.event.type == 2) {
            data.event.data.node.childNodes = removeScriptAndEvents(data.event.data.node.childNodes)
        } else if (data.event.type == 3) {
            if (data.event.data.adds && data.event.data.adds.length > 0) {
                data.event.data.adds = formatAddsData(data.event.data.adds)
            } else if (data.event.data.attributes && data.event.data.attributes.length > 0) {
                data.event.data.attributes = formatAttributesData(data.event.data.attributes)
            }
        }

        io.to(data.room).emit("user-event", data.event)
    })

    socket.on("receive-event", function (data) {
        console.log("message from agent in room... " + data.room)
        io.to(data.room).emit("agent-event", data.event)
    })

    socket.on("disconnect", function () {
        io.to(roomName).emit("agent-event", "connection lost")
        io.to(roomName).emit("user-event", "connection lost")
    })
})

io.listen(3000, () => {
    console.log("Socket started on port 3000")
})

function removeScriptAndEvents(childNodes) {
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type == 2) {
            var obj = {}
            var attrKeys = Object.keys(childNodes[i].attributes)

            if (childNodes[i].tagName == "script") {
                if (childNodes[i].childNodes) {
                    childNodes[i].childNodes = []
                }
                if (attrKeys.includes("cb-elementid")) {
                    obj["cb-elementid"] = childNodes[i].attributes["cb-elementid"]
                } else {
                    obj["cb-tempid"] = childNodes[i].id
                }

                if (attrKeys.includes("cb-hostid")) {
                    obj["cb-hostid"] = childNodes[i].attributes["cb-hostid"]
                }

                childNodes[i].attributes = obj
            } else {
                for (let j = 0; j < attrKeys.length; j++) {
                    if (!allEvents.includes(attrKeys[j])) {
                        obj[attrKeys[j]] = childNodes[i].attributes[attrKeys[j]]
                    }
                    if (!attrKeys.includes("cb-elementid")) {
                        obj["cb-tempid"] = childNodes[i].id
                    }
                }
                childNodes[i].attributes = obj
            }
        }

        if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
            childNodes[i].childNodes = removeScriptAndEvents(childNodes[i].childNodes)
            // removeScriptAndEvents(childNodes[i].childNodes)
        }
    }
    return childNodes
}

function formatAddsData(addsArr) {
    for (let i = 0; i < addsArr.length; i++) {
        addsArr[i].node = addCBIDToTags([addsArr[i].node])[0]
        addsArr[i].node = removeScriptAndEvents([addsArr[i].node])[0]
    }
    return addsArr
}

function formatAttributesData(attributesArr) {
    for (let i = 0; i < attributesArr.length; i++) {
        attributesArr[i].attributes = removeAttributesEvents(attributesArr[i].attributes)
    }
    return attributesArr
}

function removeAttributesEvents(attributesObj) {
    var obj = {}
    var attrKeys = Object.keys(attributesObj)
    for (let i = 0; i < attrKeys.length; i++) {
        if (!allEvents.includes(attrKeys[i])) {
            obj[attrKeys[i]] = attributesObj[attrKeys[i]]
        }
    }
    return obj
}

function addCBIDToTags(childNodes) {
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type == 2) {
            var attrKeys = Object.keys(childNodes[i].attributes)
            if (!attrKeys.includes("cb-elementid")) {
                childNodes[i].attributes["cb-tempid"] = childNodes[i].id
            }
            if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                childNodes[i].childNodes = addCBIDToTags(childNodes[i].childNodes)
            }
        }
    }
    return childNodes
}
