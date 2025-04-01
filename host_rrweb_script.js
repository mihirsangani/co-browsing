setTimeout(() => {
    // recevied from agent side
    socket.on("agent-event", (changeEvent) => {
        applyHostIncrementChanges(changeEvent)
    })
}, 5000)

function applyHostIncrementChanges(changeEvent) {
    changeEvent = JSON.parse(JSON.stringify(changeEvent))
    console.log("before apply: ", changeEvent)

    if (changeEvent.type == 3) {
        console.log("entered")
        if (changeEvent.data.source == 2) {
            // Mouse Click Out
            if (changeEvent.data.type == 2) {
                document.querySelector(changeEvent.data["clickedOn"]).click()
            }
        } else if (changeEvent.data.source == 3) {
            // Scroll Event
            var xAxis = changeEvent.data.x ? changeEvent.data.x : 0
            var yAxis = changeEvent.data.y ? changeEvent.data.y : 0
            document.scrollTo(xAxis, yAxis)
        } else if (changeEvent.data.source == 5) {
            // Input Value
            document.querySelector(`[cb-hostid='${changeEvent.data["cb-hostid"]}']`).value = changeEvent.data.text
        }
    }
}

// document.querySelector(`[cb-elementid=${eventData.data.attributes[i].attributes["cb-elementid"]}]`).setAttribute("cb-hostid", eventData.data.attributes[i].id)
