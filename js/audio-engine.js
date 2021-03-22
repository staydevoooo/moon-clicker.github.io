var antAudio = function() {
        "use strict";
        var i = {},
            o = 0,
            a = function(i, a) {
                var e = new Audio;
                return e.preload = !0, e.src = a, e.load(), e.onloadeddata = function(i) {
                    o++
                }, e.setAttribute("id", i), e
            },
            e = function() {
                return o === Object.keys(i).length
            };
        return {
            init: function(o) {
                ! function(o) {
                    for (var e in o)
                        if (o.hasOwnProperty(e)) {
                            var l = o[e].url,
                                u = o[e].name;
                            if ("multiple" === o[e].playMode)
                                for (var r = 0; r < 999; r++) {
                                    var t = u + r;
                                    i[t] = a(t, l)
                                } else i[u] = a(u, l)
                        }
                }(o)
            },
            play: function(o) {
                var a = e();
                if (audioFiles[o] && a)
                    if ("multiple" === audioFiles[o].playMode) {
                        var l = o + audioFiles[o].currentPlayNum;
                        console.log("play: ", l), i[l].play(),
                            function(i) {
                                var o = audioFiles[i].currentPlayNum;
                                audioFiles[i].currentPlayNum = o < 999998 ? o + 1 : 0
                            }(o)
                    } else i[o].play();
                else console.log("could not play audio, either audio doesn't exist or still waiting for audio files to preload")
            },
            stop: function(o) {
                var a = e();
                audioFiles[o] && a && i[o].pause()
            }
        }
    }(),
    audioFiles = {
        purchase: {
            name: "purchase",
            url: "//moon-clicker.github.io/audio/click.wav",
            playMode: "multiple",
            currentPlayNum: 0
        },
        click: {
            name: "click",
            url: "//moon-clicker.github.io/audio/click.wav",
            playMode: "multiple",
            currentPlayNum: 0
        }
    };
antAudio.init(audioFiles);
