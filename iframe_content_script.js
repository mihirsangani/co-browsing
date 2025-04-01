var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = ""
        var n, r, i, s, o, u, a
        var f = 0
        e = Base64._utf8_encode(e)
        while (f < e.length) {
            n = e.charCodeAt(f++)
            r = e.charCodeAt(f++)
            i = e.charCodeAt(f++)
            s = n >> 2
            o = ((n & 3) << 4) | (r >> 4)
            u = ((r & 15) << 2) | (i >> 6)
            a = i & 63
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = ""
        var n, r, i
        var s, o, u, a
        var f = 0
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++))
            o = this._keyStr.indexOf(e.charAt(f++))
            u = this._keyStr.indexOf(e.charAt(f++))
            a = this._keyStr.indexOf(e.charAt(f++))
            n = (s << 2) | (o >> 4)
            r = ((o & 15) << 4) | (u >> 2)
            i = ((u & 3) << 6) | a
            t = t + String.fromCharCode(n)
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t)
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n")
        var t = ""
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n)
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode((r >> 6) | 192)
                t += String.fromCharCode((r & 63) | 128)
            } else {
                t += String.fromCharCode((r >> 12) | 224)
                t += String.fromCharCode(((r >> 6) & 63) | 128)
                t += String.fromCharCode((r & 63) | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = ""
        var n = 0
        var r = (c1 = c2 = 0)
        while (n < e.length) {
            r = e.charCodeAt(n)
            if (r < 128) {
                t += String.fromCharCode(r)
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1)
                t += String.fromCharCode(((r & 31) << 6) | (c2 & 63))
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1)
                c3 = e.charCodeAt(n + 2)
                t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                n += 3
            }
        }
        return t
    }
}
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
var hostObj = null
var hostUpdatedObj = null

var userObj = null
var userUpdatedObj = null

rrweb.record({
    emit(event) {
        event["allow_callback"] = true
        console.log("rrweb agent events: ", event)

        var sendFlag = true
        if (event.type == 3) {
            if (event.data.source == 5) {
                if (!event.data.userTriggered) sendFlag = false
            }

            if (event.data.source == 0) {
                sendFlag = false
            }

            if (event.data.source == 2) {
                if (event.data.type == 2) {
                    const findId = event.data.id
                    const findTag = findCBElementId(findId, userUpdatedObj.data.node.childNodes)

                    const attrKeys = Object.keys(findTag.attributes)
                    if (!event.data["clickedOn"]) {
                        if (attrKeys.includes("cb-elementid")) {
                            event.data["clickedOn"] = `[cb-elementid='${findTag.attributes["cb-elementid"]}']`
                        } else if (attrKeys.includes("cb-hostid")) {
                            event.data["clickedOn"] = `[cb-hostid='${findTag.attributes["cb-hostid"]}']`
                        } else if (attrKeys.includes("cb-tempid")) {
                            event.data["clickedOn"] = `[cb-tempid='${findTag.attributes["cb-tempid"]}']`
                        }
                    }
                }
            }
        }

        var hostFlag = false
        var formatedObj = formatObj(event, userObj, userUpdatedObj, hostFlag)
        userObj = formatedObj.mainObj
        userUpdatedObj = formatedObj.updatedObj
        var htmlContent = formatedObj.contentOfHTML
        // event = formatedObj.currEvent
        // console.log("................................................", [htmlContent, event])
        event = getEventHostID(htmlContent, event)

        if (sendFlag) {
            // ++sequenceNumber

            // event["DOMHeight"] = document.body.clientHeight
            // event["DOMWidth"] = document.body.clientWidth
            // event["seq_no"] = sequenceNumber
            console.log("Final Event: \n", [event])
            window.parent.postMessage(event, "*")
        }
    },
    userTriggeredOnInput: true
})

window.onmessage = (recievedData) => {
    incrementChangesInObj(recievedData)
}

function incrementChangesInObj(recievedData) {
    var contentOfHTML = JSON.parse(Base64.decode(recievedData.data))
    var hostFlag = true
    var formatedObj = formatObj(contentOfHTML, hostObj, hostUpdatedObj, hostFlag)
    hostObj = formatedObj.mainObj
    hostUpdatedObj = formatedObj.updatedObj
}

function formatObj(contentOfHTML, mainObj, updatedObj, hostFlag) {
    console.log("Format Obj: \n", [contentOfHTML, mainObj, updatedObj, hostFlag])

    var height = contentOfHTML.DOMHeight
    var width = contentOfHTML.DOMWidth
    var flagUpdateDOM = false
    var currObj = contentOfHTML ? contentOfHTML : null
    if (hostFlag) {
        $("body").attr({ height: height, width: width })
    }

    if (contentOfHTML.type == 2 && contentOfHTML.data.node) {
        // New HTML Added
        mainObj = contentOfHTML
        updatedObj = contentOfHTML
        flagUpdateDOM = true

        var scrollLeft = contentOfHTML.data.initialOffset.left ? contentOfHTML.data.initialOffset.left : 0
        var scrollTop = contentOfHTML.data.initialOffset.top ? contentOfHTML.data.initialOffset.top : 0

        if (hostFlag) {
            $("body").scrollLeft(scrollLeft)
            $("body").scrollTop(scrollTop)
        }
    } else if (contentOfHTML.type == 3) {
        if (!updatedObj) updatedObj = mainObj
        if (contentOfHTML.data.source == 0) {
            console.log("enter source 0")
            // Existing Element Removed
            if (contentOfHTML.data.removes.length > 0) {
                var newChild = applyIncrementRemoveChanges(contentOfHTML.data.removes, updatedObj)
                updatedObj.data.node.childNodes = newChild
            }

            // New Element Added
            if (contentOfHTML.data.adds.length > 0) {
                var newChild = applyIncrementAddChanges(contentOfHTML.data.adds, updatedObj)
                updatedObj.data.node.childNodes = newChild
            }

            // New Attributes Added
            if (contentOfHTML.data.attributes.length > 0) {
                var newChild = applyIncrementAttributeChanges(contentOfHTML.data.attributes, updatedObj)
                updatedObj.data.node.childNodes = newChild
            }

            // New TextContent Added
            if (contentOfHTML.data.texts.length > 0) {
                var newChild = applyIncrementTextContentChanges(contentOfHTML.data.texts, updatedObj)
                updatedObj.data.node.childNodes = newChild
            }
        } else if (contentOfHTML.data.source == 2) {
            // Click Event
            var XAxis = contentOfHTML.data.x ? contentOfHTML.data.x : 0
            var YAxis = contentOfHTML.data.y ? contentOfHTML.data.y : 0
            // console.log(XAxis, YAxis)

            // if (!hostFlag) {
            //     console.log("..............................", contentOfHTML, updatedObj)
            //     currObj = findDropDownEvent(contentOfHTML, updatedObj)
            //     console.log(currObj)
            // }
        } else if (contentOfHTML.data.source == 3) {
            // Scroll Event
            var scrollLeft = contentOfHTML.data.x ? contentOfHTML.data.x : 0
            var scrollTop = contentOfHTML.data.y ? contentOfHTML.data.y : 0
            if (hostFlag) {
                $("body").scrollLeft(scrollLeft)
                $("body").scrollTop(scrollTop)
            }
        } else if (contentOfHTML.data.source == 4) {
            // Document Body Height Width Event
            height = contentOfHTML.data.height ? contentOfHTML.data.height : 0
            width = contentOfHTML.data.width ? contentOfHTML.data.width : 0
            if (hostFlag) {
                $("body").attr({ height: height, width: width })
            }
        } else if (contentOfHTML.data.source == 5) {
            // New Value Added To Input Tag
            var newChild = applyIncrementValueChanges(contentOfHTML, updatedObj)
            updatedObj.data.node.childNodes = newChild
        }
        contentOfHTML = updatedObj
    } else if (contentOfHTML.type == 4 && contentOfHTML.data.href) {
        // Document Link/URL
        // console.log("Page refreshed!")
        var currentPageURL = contentOfHTML.data.href

        height = contentOfHTML.data.height
        width = contentOfHTML.data.width

        if (hostFlag) {
            if (updatedObj) {
                var bodyAttrKeys = document.body.getAttributeNames() // getElementAttributes("body", updatedObj.data.node.childNodes)
                $("body").removeAttr(bodyAttrKeys.join(" "))
                $("body").empty()
                $("head [cb-elementid]").remove()
                $("head [cb-tempid]").remove()
            }
            $("body").attr({ height: height, width: width })
        }

        mainObj = null
        updatedObj = null
    } else {
        console.log("On Message Else: ", contentOfHTML)
        if (!updatedObj) updatedObj = mainObj
        contentOfHTML = updatedObj
        currObj = contentOfHTML
    }

    if (hostFlag) {
        if (flagUpdateDOM) {
            var htmlString = createHTML(contentOfHTML)
            getContentByTagName(htmlString, "body")
            getContentByTagName(htmlString, "head")
        } else {
            currObj ? applyIncrementChanges(currObj, contentOfHTML) : console.log("No Data Found!")
        }
    }

    return {
        mainObj: mainObj,
        updatedObj: updatedObj,
        contentOfHTML: contentOfHTML,
        currEvent: currObj
    }
}

function applyIncrementChanges(incrementalObj, currObj) {
    if (incrementalObj.data.source == 0) {
        // Incremental Removes
        if (incrementalObj.data.removes.length > 0) {
            var removes = incrementalObj.data.removes
            for (let i = 0; i < removes.length; i++) {
                var findRemoveId = removes[i].parentId
                var currNode = findCBElementId(findRemoveId, currObj.data.node.childNodes)

                if (currNode.removeElementId.length > 0) {
                    for (let j = 0; j < currNode.removeElementId.length; j++) {
                        $(currNode.removeElementId[j]).remove()
                    }
                } else {
                    console.log("(source:0{removes}) Kickit Class not found.", currNode)
                }
            }
        }

        // Incremental Adds
        if (incrementalObj.data.adds.length > 0) {
            var adds = incrementalObj.data.adds
            for (let i = 0; i < adds.length; i++) {
                var incrementalHTML = getchildNodes([adds[i].node])
                var currId = adds[i].node.id
                var findId = adds[i].parentId
                var currNode = findCBElementId(findId, currObj.data.node.childNodes)

                // var checkData = currNode.childNodes.filter((obj) => obj.id == currId)
                // console.log("-----------------------------------------------------------------------------------------------------\n\n")
                // console.log("Adding Data: ", adds[i], currNode, checkData)
                // console.log("\n\n-----------------------------------------------------------------------------------------------------")
                // if (checkData.length > 0) {
                //     console.log("Data already added.")
                // } else {
                if (adds[i].nextId) {
                    var findId = adds[i].nextId
                    var currNextNode = findCBElementId(findId, currObj.data.node.childNodes)
                    var appendFlag = false
                    if (currNextNode.type != 2) {
                        var nextNode = findTagFromNodes(currNode.childNodes, adds[i].nextId)
                        if (nextNode) {
                            currNode = nextNode
                        } else {
                            appendFlag = true
                        }
                    } else {
                        currNode = currNextNode
                    }

                    var attrKeys = Object.keys(currNode.attributes)
                    if (attrKeys.includes("cb-elementid")) {
                        var tag = `[cb-elementid=${currNode.attributes["cb-elementid"]}]`
                    } else if (attrKeys.includes("cb-tempid")) {
                        var tag = `[cb-tempid=${currNode.attributes["cb-tempid"]}]`
                    } else {
                        console.log("(source:0){adds} cb-id not found", currNode)
                    }

                    if (appendFlag) {
                        $(tag).append(incrementalHTML)
                    } else {
                        $(incrementalHTML).insertBefore($(tag))
                    }
                } else {
                    var attrKeys = Object.keys(currNode.attributes)
                    if (attrKeys.includes("cb-elementid")) {
                        var tag = `[cb-elementid=${currNode.attributes["cb-elementid"]}]`
                    } else if (attrKeys.includes("cb-tempid")) {
                        var tag = `[cb-tempid=${currNode.attributes["cb-tempid"]}]`
                    } else {
                        console.log("(source:0){adds} cb-id not found", currNode)
                    }

                    $(tag).append(incrementalHTML)
                }
                // }
            }
        }

        // Incremental Attributes
        if (incrementalObj.data.attributes.length > 0) {
            var attributes = incrementalObj.data.attributes
            var tag = ""
            for (let i = 0; i < attributes.length; i++) {
                var findId = attributes[i].id
                var currAttrKeys = Object.keys(attributes[i].attributes)

                var currNode = findCBElementId(findId, currObj.data.node.childNodes)
                var attrKeys = Object.keys(currNode.attributes)
                // if (attrKeys.includes("cb-elementid")) {
                //     tag = `[cb-elementid=${currNode.attributes["cb-elementid"]}]`
                // } else
                if (attrKeys.includes("cb-tempid")) {
                    tag = `[cb-tempid=${currNode.attributes["cb-tempid"]}]`
                } else if (attrKeys.includes("cb-hostid")) {
                    tag = `[cb-hostid=${currNode.attributes["cb-hostid"]}]`
                } else {
                    console.log("(source:0){attributes} cb-id not found", currNode)
                }

                for (let j = 0; j < currAttrKeys.length; j++) {
                    $(tag).attr(currAttrKeys[j], currNode.attributes[currAttrKeys[j]])
                }
            }
        }

        // Incremental TextContents
        if (incrementalObj.data.texts.length > 0) {
        }
    } else if (incrementalObj.data.source == 5) {
        // Incremental Input Val()
        var currNode = findCBElementId(incrementalObj.data.id, currObj.data.node.childNodes)
        var attrKeys = Object.keys(currNode.attributes)
        if (attrKeys.includes("cb-elementid")) {
            $(`[cb-elementid=${currNode.attributes["cb-elementid"]}]`).val(incrementalObj.data.text)
        } else if (attrKeys.includes("cb-tempid")) {
            $(`[cb-tempid=${incrementalObj.data.id}]`).val(incrementalObj.data.text)
        } else {
            console.log("(source:5) cb-id not found", currNode)
        }
    }
}

function getElementAttributes(tag, htmlObj) {
    var attributes = []
    for (let i = 0; i < htmlObj.length; i++) {
        if (htmlObj[i].type == 2) {
            if (htmlObj[i].tagName == tag) {
                attributes = Object.keys(htmlObj[i].attributes)
                return attributes
            } else if (htmlObj[i].childNodes && htmlObj[i].childNodes.length > 0) {
                var attributes = getElementAttributes(tag, htmlObj[i].childNodes)
                if (attributes.length > 0) {
                    return attributes
                }
            }
        }
    }

    return attributes
}

function getContentByTagName(htmlString, tag) {
    var htmlIncTag = htmlString.substring(htmlString.indexOf(`<${tag}`), htmlString.indexOf(`</${tag}>`) + tag.length + 3)
    var htmlTagContent = htmlIncTag.substring(htmlIncTag.indexOf(">") + 1, htmlIncTag.indexOf(`</${tag}>`))
    var htmlTagAttributes = htmlIncTag.substring(htmlIncTag.indexOf(`<${tag}`) + tag.length + 1, htmlIncTag.indexOf(">"))
    $(tag).append(htmlTagContent)
    pushAttrToTag(htmlTagAttributes, tag)
}

function pushAttrToTag(attrString, tag) {
    var attrArr = attrString.split("=")
    for (let i = 0; i < attrArr.length; i++) {
        if (attrArr[i].length > 0 && i < attrArr.length - 1) {
            var attr = attrArr[i].substring(attrArr[i].lastIndexOf('"') + 1).trim()
            var value = attrArr[i + 1].substring(attrArr[i + 1].indexOf('"') + 1, attrArr[i + 1].lastIndexOf('"'))
            $(tag).attr(attr, value)
        }
    }
}

function findTagFromNodes(parentChildNode, nextId) {
    var index = parentChildNode.findIndex((obj) => obj.id == nextId)
    var node = null
    for (let i = index; i < parentChildNode.length; i++) {
        if (parentChildNode[i].type == 2) {
            node = parentChildNode[i]
            break
        }
    }
    return node
}

function findCBElementId(findId, searchData) {
    var searchData = JSON.parse(JSON.stringify(searchData))
    var returnObj = {}
    for (let i = 0; i < searchData.length; i++) {
        if (searchData[i].id == findId) {
            return searchData[i]
        } else if (searchData[i].childNodes && searchData[i].childNodes.length > 0) {
            var nodeObj = findCBElementId(findId, searchData[i].childNodes)
            if (Object.keys(nodeObj).length > 0) {
                return nodeObj
            }
        }
    }
    return returnObj
}

function applyIncrementRemoveChanges(newRemoves, prevObj) {
    var prevObjChildNodes = prevObj.data.node.childNodes
    var result = getFilteredRemovedNodes(prevObjChildNodes, newRemoves)
    return result
}

function getFilteredRemovedNodes(childNodes, newRemoves) {
    var childNodes = JSON.parse(JSON.stringify(childNodes))
    for (let j = 0; j < newRemoves.length; j++) {
        for (let i = 0; i < childNodes.length; i++) {
            if (newRemoves[j].parentId == childNodes[i].id) {
                console.log("before: \n", childNodes[i])

                var index = childNodes[i].childNodes.findIndex((obj) => obj.id == newRemoves[j].id)
                var CBID = childNodes[i].childNodes[index].attributes["cb-elementid"] ? `[cb-elementid=${childNodes[i].childNodes[index].attributes["cb-elementid"]}]` : `[cb-tempid=${childNodes[i].childNodes[index].attributes["cb-tempid"]}]`
                childNodes[i]["removeElementId"] = []
                childNodes[i].removeElementId.push(CBID)
                childNodes[i].childNodes.splice(index, 1)

                console.log("after: \n", childNodes[i])
                break
            } else if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                childNodes[i].childNodes = getFilteredRemovedNodes(childNodes[i].childNodes, [newRemoves[j]])
            }
        }
    }
    return childNodes
}

function applyIncrementAddChanges(newAdds, prevObj) {
    var prevObjChildNodes = prevObj.data.node.childNodes
    var result = getFilteredAddedNodes(prevObjChildNodes, newAdds)
    return result
}

function getFilteredAddedNodes(childNodes, newAdds) {
    var childNodes = JSON.parse(JSON.stringify(childNodes))
    for (let j = 0; j < newAdds.length; j++) {
        for (let i = 0; i < childNodes.length; i++) {
            var currNode = newAdds[j].node
            if (newAdds[j].parentId == childNodes[i].id) {
                if (childNodes[i].childNodes) {
                    if (newAdds[j].nextId) {
                        var index = childNodes[i].childNodes.findIndex((obj) => obj.id == newAdds[j].nextId)
                        childNodes[i].childNodes.splice(index, 0, currNode)
                    } else {
                        childNodes[i].childNodes.push(currNode)
                    }
                    break
                } else {
                    childNodes[i]["childNodes"] = []
                    childNodes[i].childNodes.push(currNode)
                }
            } else if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                childNodes[i].childNodes = getFilteredAddedNodes(childNodes[i].childNodes, [newAdds[j]])
            }
        }
    }
    return childNodes
}

function applyIncrementTextContentChanges(newTexts, prevObj) {
    var prevObjChildNodes = prevObj.data.node.childNodes
    var result = getFilteredTextContent(prevObjChildNodes, newTexts)
    return result
}

function getFilteredTextContent(childNodes, newTextsArr) {
    var childNodes = JSON.parse(JSON.stringify(childNodes))
    for (let j = 0; j < newTextsArr.length; j++) {
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].id == newTextsArr[j].id) {
                childNodes[i].textContent = newTextsArr[j].value
            } else if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                childNodes[i].childNodes = getFilteredTextContent(childNodes, [newTextsArr[j]])
            }
        }
    }
    return childNodes
}

function applyIncrementAttributeChanges(newAttributes, prevObj) {
    var prevObjChildNodes = prevObj.data.node.childNodes
    var result = getTagAttributes(prevObjChildNodes, newAttributes)
    return result
}

function getTagAttributes(childNodes, newArr) {
    var childNodes = JSON.parse(JSON.stringify(childNodes))
    for (let j = 0; j < newArr.length; j++) {
        for (let i = 0; i < childNodes.length; i++) {
            if (newArr[j].id == childNodes[i].id) {
                var attrKeys = Object.keys(newArr[j].attributes)

                for (let k = 0; k < attrKeys.length; k++) {
                    var values = ""
                    var currValue = newArr[j].attributes[attrKeys[k]]

                    if (!currValue) {
                        childNodes[i].attributes[attrKeys[k]] = null
                    } else if (typeof currValue === "object") {
                        var attrKeysValues = Object.keys(currValue)
                        var oldKeyValues = childNodes[i].attributes[attrKeys[k]] ? childNodes[i].attributes[attrKeys[k]].split(";") : []

                        for (let l = 0; l < attrKeysValues.length; l++) {
                            if (childNodes[i].attributes[attrKeys[k]]) {
                                var index = oldKeyValues.findIndex((item) => item.indexOf(`${attrKeysValues[l]}:`) > -1)
                                if (index > -1) {
                                    oldKeyValues.splice(index, 1)
                                }
                            }

                            if (currValue[attrKeysValues[l]] || currValue[attrKeysValues[l]] == false) {
                                values += `${attrKeysValues[l]}:${currValue[attrKeysValues[l]]};`
                            }
                        }
                        childNodes[i].attributes[attrKeys[k]] = oldKeyValues.length > 1 ? oldKeyValues.join(";") + values : values
                    } else if (typeof currValue === "string") {
                        childNodes[i].attributes[attrKeys[k]] = currValue
                    }
                }
            } else if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                childNodes[i].childNodes = getTagAttributes(childNodes[i].childNodes, [newArr[j]])
            }
        }
    }

    return childNodes
}

function applyIncrementValueChanges(newObj, prevObj) {
    var prevObjChildNodes = prevObj.data.node.childNodes
    var result = getFilteredChildNode(prevObjChildNodes, newObj)
    return result
}

function getFilteredChildNode(childNodes, newObj) {
    // var childNodes = JSON.parse(JSON.stringify(childNodes))
    var findID = newObj.data.id
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].id == findID) {
            // if (childNodes[i].tagName === "input") {
            childNodes[i].attributes["value"] = newObj.data.text
            // } else {
            //     childNodes[i].childNodes.push({ type: 3, textContent: newObj.data.text })
            // }
            break
        } else if (childNodes[i].id != findID && childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
            childNodes[i].childNodes = getFilteredChildNode(childNodes[i].childNodes, newObj)
        }
    }

    return childNodes
}

function createHTML(htmlObj) {
    var currentString = ""

    var nodeType = htmlObj.type
    var nodeData = htmlObj.data

    if (nodeType == 2 && nodeData.node) {
        var currentChild = nodeData.node.childNodes
        currentString = getchildNodes(currentChild)
    }

    return currentString
}

function getchildNodes(currentChild) {
    // var currentChild = JSON.parse(JSON.stringify(currentChild))
    var selfClosingTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr", "command", "keygen", "menuitem"]
    var htmlstring = ""
    for (let i = 0; i < currentChild.length; i++) {
        if (currentChild[i].type == 1) {
            // htmlstring += `<!DOCTYPE html>`
        } else if (currentChild[i].type == 2) {
            if (currentChild[i].tagName === "link" && (currentChild[i].attributes._cssText || currentChild[i].attributes.rel)) {
                htmlstring += `<style`
                var attrKey = Object.keys(currentChild[i].attributes)
                if (attrKey.length > 1) {
                    for (let j = 0; j < attrKey.length; j++) {
                        // if (attrKey[j] != "_cssText" && attrKey[j] != "rel" && attrKey[j] != "href") {
                        if (attrKey[j] == "cb-elementid" || attrKey[j] == "cb-tempid") {
                            htmlstring += ` ${attrKey[j]}="${currentChild[i].attributes[attrKey[j]]}"`
                        }
                    }
                }
                htmlstring += `>\n${currentChild[i].attributes._cssText ? currentChild[i].attributes._cssText : ""}\n</style>\n`
            } else {
                htmlstring += `<${currentChild[i].tagName}`
                var attrKey = Object.keys(currentChild[i].attributes)
                if (attrKey.length > 0) {
                    for (let j = 0; j < attrKey.length; j++) {
                        htmlstring += ` ${attrKey[j]}="${currentChild[i].attributes[attrKey[j]]}"`
                    }
                }
                if (selfClosingTags.includes(currentChild[i].tagName.toLowerCase())) {
                    htmlstring += ` />\n`
                } else {
                    htmlstring += `>`
                    if (currentChild[i].childNodes.length > 0) {
                        htmlstring += getchildNodes(currentChild[i].childNodes)
                    }
                    htmlstring += `</${currentChild[i].tagName}>\n`
                }
            }
        } else if (currentChild[i].type == 3) {
            htmlstring += `${currentChild[i].textContent.trim() ? currentChild[i].textContent.trim() : ""}`
        } else if (currentChild[i].type == 5) {
            htmlstring += `<!-- ${currentChild[i].textContent.trim() ? currentChild[i].textContent.trim() : ""} -->\n`
        } else {
            console.log("else getChildNode function: ", currentChild[i])
            console.log("index of else", i)
        }
    }
    return htmlstring
}

function removeScriptTag(html) {
    var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
    html = html.toString().replace(scriptRegex, "")
    return html
}

function removeAttribtes(html) {
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
    for (i = 0; i < allEvents.length; i++) {
        var index1 = html.indexOf(allEvents[i])
        if (index1 > -1) {
            var substr = html.substring(index1 + allEvents[i].length + 2, html.length)
            var identifier = html.substring(index1 + allEvents[i].length + 1, index1 + allEvents[i].length + 2)
            substr = substr.substring(0, substr.indexOf(identifier))
            html = html.replace(substr, "")
        }
    }
    return html
}

function generateUniqueClass() {
    var length = 10
    var result = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return `kickit-id${result}${new Date().getTime()}`
}

function getEventHostID(content, findData) {
    if (findData.type == 3) {
        var contentChildNodes = content.data.node.childNodes
        // Input Value
        if (findData.data.source == 5) {
            var findId = findData.data.id
            findData.data["cb-hostid"] = findHostIdForInputValue(contentChildNodes, findId)
        }
    }
    return findData
}

function findHostIdForInputValue(childNodes, findId) {
    var hostId = null
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].id == findId) {
            hostId = childNodes[i].attributes["cb-hostid"]
            return hostId
        } else if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
            hostId = findHostIdForInputValue(childNodes[i].childNodes, findId)
            if (hostId) return hostId
        }
    }
    return hostId
}

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
        // addsArr[i].node = addCBIDToTags([addsArr[i].node])[0]
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

// function findDropDownEvent(newObj, prevObj) {
//     var findID = newObj.data.id
//     var prevObjChildNodes = prevObj.data.node.childNodes
//     console.log(prevObjChildNodes, findID)
//     var result = findTagUsingId(prevObjChildNodes, findID)
//     console.log("result: ", result)
//     if (result) {
//         newObj.data["selectTagFlag"] = true
//         newObj.data["selectedOption"] = result
//     }
//     console.log("New ", newObj.data)
//     return newObj
// }

// function findTagUsingId(childNodes, findId) {
//     var childNodes = JSON.parse(JSON.stringify(childNodes))
//     var flagSelectTag = false
//     var selectedOptionValue = null
//     for (let i = 0; i < childNodes.length; i++) {
//         if (childNodes[i].id == findId) {
//             console.log("ChildNode: ", childNodes[i])
//             if (childNodes[i].tagName == "select") {
//                 flagSelectTag = true
//                 if (childNodes[i].attributes["cb-elementid"]) {
//                     selectedOptionValue = $(`[cb-elementid=${childNodes[i].attributes["cb-elementid"]}] :selected`).text()
//                 } else if (childNodes[i].attributes["cb-hostid"]) {
//                     selectedOptionValue = $(`[cb-hostid=${childNodes[i].attributes["cb-hostid"]}] :selected`).text()
//                 }

//                 var selectedElementId = childNodes[i].childNodes.filter((obj) => obj.type == 2 && obj.childNodes[0].textContent == selectedOptionValue)
//                 // console.log("Selected cb-elementid and text: ", selectedElementId)
//                 document.querySelector(`[cb-elementid=${selectedElementId[0].attributes["cb-elementid"]}]`).setAttribute("selected", true)
//             }
//         } else if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
//             selectedOptionValue = findTagUsingId(childNodes[i].childNodes, findId)
//             if (flagSelectTag) return selectedOptionValue
//         }
//     }
//     return selectedOptionValue
// }
