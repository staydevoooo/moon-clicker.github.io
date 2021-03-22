var antAudio = function() {
    "use strict";
    var
        maxAudioInstances = 999, // Number of unique copies of audio to load into memory for any audio set to "multiple" (defaults to 5)
        audioClips = {}, // all instances of pre-loaded Audio stored here for access from the playAudio() function
        loadedCount = 0, // keeps track of how many audio clips have been loaded
        
        // Load audio by creating a new HTML5 Audio() object
        loadAudio = function(audioName, src) {
            var _audio = new Audio();
            _audio.preload = true; // to make sure audio clips preload
            _audio.src = src;
            _audio.load(); // go ahead and load it
            
            // event which fires each time an audio clip is loaded and ready to play
            _audio.onloadeddata = function(e) {
                //console.log("preloaded ", audioName);
                loadedCount++;
            };
            
            _audio.setAttribute("id", audioName); // sets a unique id on each audio elem in case you need to target directly later
            return _audio;
        },
        
        loadAudioInstances = function(audioFiles) {
            
            // loop through each audio file entry in audioFiles object and decide whether to load multiple or single instances of it, then load accordingly
            for (var item in audioFiles) {
                if (audioFiles.hasOwnProperty(item)) {
                    
                    var src = audioFiles[item].url;
                    var audioName = audioFiles[item].name;
                    
                    // if the clip is set as "multiple" - load multiple copies
                    if (audioFiles[item].playMode === "multiple") {
                        for (var x = 0; x < maxAudioInstances; x++) {
                            var newAudioName = audioName + x;
                            audioClips[newAudioName] = loadAudio(newAudioName, src);
                        }
                    } else {
                        audioClips[audioName] = loadAudio(audioName, src);
                    }
                    
                }
            }
        },
        
        // update counter to know which clip instace should play next
        updatePlayCount = function(item) {
            // cpn = current play number
            var cpn = audioFiles[item].currentPlayNum;
            audioFiles[item].currentPlayNum = (cpn < (maxAudioInstances - 1)) ? (cpn + 1) : 0; // Reset to zero if already reached the maxNumOfAudioCopies for current audio file to start again from the beginning of the set loaded into the DOM
            
        },
        
        // returns true if all audio clips have finished preloadeding
        isAudioPreloaded = function() {
            return (loadedCount === Object.keys(audioClips).length) ? true : false;
        },
        
        // used to play an audio clip - it will only attempt to play the file if all clips have finished preloading
        playAudio = function(item) {
            var audioIsReady = isAudioPreloaded();
            // if audioFile exists in audioFiles and all audio has loaded
            if (audioFiles[item] && audioIsReady) {
                
                if (audioFiles[item].playMode === "multiple") {
                    var cpos = audioFiles[item].currentPlayNum; // current clip number
                    var clipName = item + cpos;
                    console.log("play: ", clipName);
                    audioClips[clipName].play();
                    updatePlayCount(item); // update so next time uses a different clip instance
                } else {
                    audioClips[item].play();
                }
            } else {
                console.log("could not play audio, either audio doesn't exist or still waiting for audio files to preload");
            }
        },
        stopAudio = function(item) {
            var audioIsReady = isAudioPreloaded();
            
            if (audioFiles[item] && audioIsReady) {
                audioClips[item].pause();
                
            }
        },
        
        init = function(audioFiles) {
            loadAudioInstances(audioFiles);
        };
    
    return {
        init: init,
        play: playAudio,
        stop: stopAudio
    };
}();

// initalise and loadAudio
antAudio.init(audioFiles);
