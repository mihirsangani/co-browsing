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
var socket = io("http://localhost:3000")

var firstEvent = null
var roomName = "SqFR5uoLEUX8Qzuo66xF686qxf23"

// const replayer = new rrweb.Replayer([], {
//     liveMode: true
// })
// replayer.startLive()

var initialHtml = `
<html class='rootHTMLKickIt'>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb-all.min.js"></script>
        <script src='http://localhost/Co-Browsing/co-browsing/iframe_content_script.js' id='cbagentscript'></script>
    </head>
</html>`
document.getElementById("screen").src = "data:text/html;charset=utf-8," + escape(initialHtml)

$(document).ready(() => {
    socket.on("connect", () => {
        socket.emit("new-user", roomName)

        // received from user side
        socket.on("user-event", (data) => {
            // console.log("rrweb user events", data)
            document.getElementById("screen").contentWindow.postMessage(Base64.encode(JSON.stringify(data)), "*")
        })

        // sent to server room for agent
        window.addEventListener("message", function (iFrameEventMessage) {
            // Get the sent data
            const data = iFrameEventMessage.data
            console.log("Agent Data: ", data)
            socket.emit("receive-event", { event: data, room: roomName })
        })
    })
})
