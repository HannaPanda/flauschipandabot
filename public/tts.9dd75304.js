// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"static/tts.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var audioContext;
var analyser;
var dataArray;
var threshold = 128;
var currentEmotion = 'neutral';
var currentMouthStatus = 'closed';
var currentEyeStatus = 'open';
document.addEventListener('click', function () {
  // Erstellt den AudioContext, wenn der Benutzer auf die Seite klickt
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  console.log("AudioContext started");
  startAudioAnalysis();

  // Weitere Audio-Verarbeitung hier
});

function simulateBlink() {
  console.log('blink');
  // Define the probability of double blinking
  var doubleBlinkProbability = 0.2; // 20% chance to double blink

  setCharacterStatus(null, null, 'closed');

  // Open the eye after a short duration
  setTimeout(function () {
    setCharacterStatus(null, null, 'open');
    if (Math.random() < doubleBlinkProbability) {
      setTimeout(function () {
        setCharacterStatus(null, null, 'closed');
        setTimeout(function () {
          setCharacterStatus(null, null, 'open');
        }, 100);
      }, 300);
    }
  }, 100);

  // Determine the next blink time (randomly between 2 and 10 seconds)
  var nextBlink = Math.random() * 8000 + 2000;

  // Call the function again after a random time
  setTimeout(simulateBlink, nextBlink);
}
function setCharacterStatus() {
  var emotion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'neutral';
  var mouth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'closed';
  var eye = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'open';
  currentEmotion = emotion || currentEmotion;
  currentMouthStatus = mouth || currentMouthStatus;
  currentEyeStatus = eye || currentEyeStatus;
  document.getElementById('character').src = '/static/images/pngtuber/' + currentEmotion + '_' + currentMouthStatus + '_' + currentEyeStatus + '.png';
}
function startAnimation() {
  var character = document.getElementById('character');
  switch (currentEmotion) {
    case 'mad':
      character.style.animation = 'wackeln 0.5s infinite';
      break;
    case 'sad':
      character.style.animation = 'traurig 1s infinite';
      break;
    case 'shy':
      character.style.animation = 'schuechtern 1s infinite';
      break;
    case 'happy':
      character.style.animation = 'gluecklich 0.6s infinite';
      break;
    default:
      character.style.animation = 'huepfen 0.5s 1';
  }
}

// Funktion, um das Hüpfen zu stoppen
function stopAnimation() {
  document.getElementById('character').style.animation = '';
}
function startAudioAnalysis() {
  var analyzeAudio = function analyzeAudio() {
    requestAnimationFrame(analyzeAudio);
    analyser.getByteFrequencyData(dataArray);
    var sum = dataArray.reduce(function (a, b) {
      return a + b;
    }, 0);
    var average = sum / dataArray.length;
    if (average > 12) {
      setCharacterStatus(null, 'open', null);
      startAnimation();
    } else {
      setCharacterStatus(null, 'closed', null);
      stopAnimation();
    }
  };
  analyzeAudio();
}
function playAudio(url, volume) {
  fetch(url).then(function (response) {
    return response.blob();
  }).then(function (blob) {
    var url = URL.createObjectURL(blob);
    var audio = new Audio(url);
    // Jetzt können Sie das Audio-Element verwenden

    audio.setAttribute("preload", "auto");
    audio.volume = volume;
    audio.autoplay = true;
    var source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    audio.addEventListener('ended', function () {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.remove();
      source.disconnect();
      isPlaying = false;
    });
    document.getElementById("root").appendChild(audio);
  }).catch(function (error) {
    return console.error('Error:', error);
  });
}
var messageQueue = [];
var messageQueueNoText = [];
var audioQueue = [];
var isShowing = false;
var isPlaying = false;
var socket = io();
socket.on('bot.say', function (msg) {
  messageQueue.push(msg);
});
socket.on('bot.say.notext', function (msg) {
  messageQueueNoText.push(msg);
});
socket.on('bot.playAudio', function (msg) {
  console.log(msg);
  if (Array.isArray(msg)) {
    audioQueue.push.apply(audioQueue, _toConsumableArray(msg.reverse()));
  } else {
    audioQueue.push(msg);
  }
});
window.setInterval(function () {
  if (!isShowing && !isPlaying && messageQueue.length > 0) {
    isShowing = true;
    isPlaying = true;
    var $text = $('<p></p>');
    var text = messageQueue.pop();
    $text.text(text);
    $text.hide();
    $('#chat-wrapper').append($text);
    $text.fadeIn(200).delay(Math.max(3000, text.split(' ').length / 130 * 60000)).fadeOut(200, function () {
      $text.remove();
      isShowing = false;
    });
    playAudio("https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text=" + text, 0.5);
  }
}, 500);
window.setInterval(function () {
  if (!isShowing && !isPlaying && messageQueueNoText.length > 0) {
    isPlaying = true;
    var text = messageQueueNoText.pop();
    playAudio("https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text=" + text, 0.5);
  }
}, 500);
window.setInterval(function () {
  if (!isShowing && !isPlaying && audioQueue.length > 0) {
    isPlaying = true;
    var _audioQueue$pop = audioQueue.pop(),
      path = _audioQueue$pop.path,
      emotion = _audioQueue$pop.emotion;
    setCharacterStatus(emotion, null, null);
    playAudio(path, 0.5);
  }
}, 500);
socket.on('reload', function (msg) {
  location.reload();
});
window.addEventListener('DOMContentLoaded', function () {
  setCharacterStatus();
  document.getElementById('character').click();
  simulateBlink();
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60705" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","static/tts.js"], null)
//# sourceMappingURL=/static/tts.9dd75304.js.map