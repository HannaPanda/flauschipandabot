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
})({"../node_modules/speak-tts/lib/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trim = exports.isObject = exports.isNil = exports.isNan = exports.size = exports.isString = exports.validateLocale = exports.splitSentences = void 0;

var splitSentences = function splitSentences() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return text.replace(/\.+/g, '.|').replace(/\?/g, '?|').replace(/\!/g, '!|').split("|").map(function (sentence) {
    return trim(sentence);
  }).filter(Boolean);
};

exports.splitSentences = splitSentences;
var bcp47LocalePattern = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i; // eslint-disable-line max-len

/**
 * Validate a locale string to test if it is bcp47 compliant
 * @param {String} locale The tag locale to parse
 * @return {Boolean} True if tag is bcp47 compliant false otherwise
 */

var validateLocale = function validateLocale(locale) {
  return typeof locale !== 'string' ? false : bcp47LocalePattern.test(locale);
};

exports.validateLocale = validateLocale;

var isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

exports.isString = isString;

var size = function size(value) {
  return value && Array.isArray(value) && value.length ? value.length : 0;
};

exports.size = size;

var isNan = function isNan(value) {
  return typeof value === "number" && isNaN(value);
};

exports.isNan = isNan;

var isNil = function isNil(value) {
  return value === null || value === undefined;
};

exports.isNil = isNil;

var isObject = function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
};

exports.isObject = isObject;

var trim = function trim(value) {
  return isString(value) ? value.trim() : '';
};

exports.trim = trim;
},{}],"../node_modules/speak-tts/lib/speak-tts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SpeakTTS =
/*#__PURE__*/
function () {
  function SpeakTTS() {
    _classCallCheck(this, SpeakTTS);

    this.browserSupport = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    this.synthesisVoice = null;
  }

  _createClass(SpeakTTS, [{
    key: "init",
    value: function init() {
      var _this = this;

      var conf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Promise(function (resolve, reject) {
        if (!_this.browserSupport) {
          reject('Your browser does not support Speech Synthesis');
        }

        var listeners = (0, _utils.isNil)(conf.listeners) ? {} : conf.listeners;
        var splitSentences = (0, _utils.isNil)(conf.splitSentences) ? true : conf.splitSentences;
        var lang = (0, _utils.isNil)(conf.lang) ? undefined : conf.lang;
        var volume = (0, _utils.isNil)(conf.volume) ? 1 : conf.volume;
        var rate = (0, _utils.isNil)(conf.rate) ? 1 : conf.rate;
        var pitch = (0, _utils.isNil)(conf.pitch) ? 1 : conf.pitch;
        var voice = (0, _utils.isNil)(conf.voice) ? undefined : conf.voice; // Attach event listeners

        Object.keys(listeners).forEach(function (listener) {
          var fn = listeners[listener];

          var newListener = function newListener(data) {
            fn && fn(data);
          };

          if (listener !== 'onvoiceschanged') {
            speechSynthesis[listener] = newListener;
          }
        });

        _this._loadVoices().then(function (voices) {
          // Handle callback onvoiceschanged by hand
          listeners['onvoiceschanged'] && listeners['onvoiceschanged'](voices); // Initialize values if necessary

          !(0, _utils.isNil)(lang) && _this.setLanguage(lang);
          !(0, _utils.isNil)(voice) && _this.setVoice(voice);
          !(0, _utils.isNil)(volume) && _this.setVolume(volume);
          !(0, _utils.isNil)(rate) && _this.setRate(rate);
          !(0, _utils.isNil)(pitch) && _this.setPitch(pitch);
          !(0, _utils.isNil)(splitSentences) && _this.setSplitSentences(splitSentences);
          resolve({
            voices: voices,
            lang: _this.lang,
            voice: _this.voice,
            volume: _this.volume,
            rate: _this.rate,
            pitch: _this.pitch,
            splitSentences: _this.splitSentences,
            browserSupport: _this.browserSupport
          });
        }).catch(function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: "_fetchVoices",
    value: function _fetchVoices() {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          var voices = speechSynthesis.getVoices();

          if ((0, _utils.size)(voices) > 0) {
            return resolve(voices);
          } else {
            return reject("Could not fetch voices");
          }
        }, 100);
      });
    }
  }, {
    key: "_loadVoices",
    value: function _loadVoices() {
      var _this2 = this;

      var remainingAttempts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      return this._fetchVoices().catch(function (error) {
        if (remainingAttempts === 0) throw error;
        return _this2._loadVoices(remainingAttempts - 1);
      });
    }
  }, {
    key: "hasBrowserSupport",
    value: function hasBrowserSupport() {
      return this.browserSupport;
    }
  }, {
    key: "setVoice",
    value: function setVoice(voice) {
      var synthesisVoice;
      var voices = speechSynthesis.getVoices(); // set voice by name

      if ((0, _utils.isString)(voice)) {
        synthesisVoice = voices.find(function (v) {
          return v.name === voice;
        });
      } // Set the voice in conf if found


      if ((0, _utils.isObject)(voice)) {
        synthesisVoice = voice;
      }

      if (synthesisVoice) {
        this.synthesisVoice = synthesisVoice;
      } else {
        throw 'Error setting voice. The voice you passed is not valid or the voices have not been loaded yet.';
      }
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(lang) {
      lang = lang.replace('_', '-'); // some Android versions seem to ignore BCP 47 and use an underscore character in language tag

      if ((0, _utils.validateLocale)(lang)) {
        this.lang = lang;
      } else {
        throw 'Error setting language. Please verify your locale is BCP47 format (http://schneegans.de/lv/?tags=es-FR&format=text)';
      }
    }
  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      volume = parseFloat(volume);

      if (!(0, _utils.isNan)(volume) && volume >= 0 && volume <= 1) {
        this.volume = volume;
      } else {
        throw 'Error setting volume. Please verify your volume value is a number between 0 and 1.';
      }
    }
  }, {
    key: "setRate",
    value: function setRate(rate) {
      rate = parseFloat(rate);

      if (!(0, _utils.isNan)(rate) && rate >= 0 && rate <= 10) {
        this.rate = rate;
      } else {
        throw 'Error setting rate. Please verify your volume value is a number between 0 and 10.';
      }
    }
  }, {
    key: "setPitch",
    value: function setPitch(pitch) {
      pitch = parseFloat(pitch);

      if (!(0, _utils.isNan)(pitch) && pitch >= 0 && pitch <= 2) {
        this.pitch = pitch;
      } else {
        throw 'Error setting pitch. Please verify your pitch value is a number between 0 and 2.';
      }
    }
  }, {
    key: "setSplitSentences",
    value: function setSplitSentences(splitSentences) {
      this.splitSentences = splitSentences;
    }
  }, {
    key: "speak",
    value: function speak(data) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var text = data.text,
            _data$listeners = data.listeners,
            listeners = _data$listeners === void 0 ? {} : _data$listeners,
            _data$queue = data.queue,
            queue = _data$queue === void 0 ? true : _data$queue;
        var msg = (0, _utils.trim)(text);
        if ((0, _utils.isNil)(msg)) resolve(); // Stop current speech

        !queue && _this3.cancel(); // Split into sentences (for better result and bug with some versions of chrome)

        var utterances = [];
        var sentences = _this3.splitSentences ? (0, _utils.splitSentences)(msg) : [msg];
        sentences.forEach(function (sentence, index) {
          var isLast = index === (0, _utils.size)(sentences) - 1;
          var utterance = new SpeechSynthesisUtterance();
          if (_this3.synthesisVoice) utterance.voice = _this3.synthesisVoice;
          if (_this3.lang) utterance.lang = _this3.lang;
          if (_this3.volume) utterance.volume = _this3.volume; // 0 to 1

          if (_this3.rate) utterance.rate = _this3.rate; // 0.1 to 10

          if (_this3.pitch) utterance.pitch = _this3.pitch; //0 to 2

          utterance.text = sentence; // Attach event listeners

          Object.keys(listeners).forEach(function (listener) {
            var fn = listeners[listener];

            var newListener = function newListener(data) {
              fn && fn(data);

              if (listener === 'onerror') {
                reject({
                  utterances: utterances,
                  lastUtterance: utterance,
                  error: data
                });
              }

              if (listener === 'onend') {
                if (isLast) resolve({
                  utterances: utterances,
                  lastUtterance: utterance
                });
              }
            };

            utterance[listener] = newListener;
          });
          utterances.push(utterance);
          speechSynthesis.speak(utterance);
        });
      });
    }
  }, {
    key: "pending",
    value: function pending() {
      return speechSynthesis.pending;
    }
  }, {
    key: "paused",
    value: function paused() {
      return speechSynthesis.paused;
    }
  }, {
    key: "speaking",
    value: function speaking() {
      return speechSynthesis.speaking;
    }
  }, {
    key: "pause",
    value: function pause() {
      speechSynthesis.pause();
    }
  }, {
    key: "resume",
    value: function resume() {
      speechSynthesis.resume();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      speechSynthesis.cancel();
    }
  }]);

  return SpeakTTS;
}();

var _default = SpeakTTS;
exports.default = _default;
},{"./utils":"../node_modules/speak-tts/lib/utils.js"}],"static/tts.js":[function(require,module,exports) {
"use strict";

var _speakTts = _interopRequireDefault(require("speak-tts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _init() {
  /*const speech = new Speech();
  speech
      .init({
          volume: 0.5,
          lang: "en-GB",
          rate: 1,
          pitch: 1,
          //'voice':'Microsoft Katja - German (Germany) (de-DE)',
          //'splitSentences': false,
          listeners: {
              onvoiceschanged: voices => {
                  console.log("Voices changed", voices);
              }
          }
      })
      .then(data => {
          let messageQueue = [];
          let isShowing = false;
            var socket = io();
          socket.on('bot.say', function(msg) {
              messageQueue.push(msg);
          });
            window.setInterval(() => {
              if(!isShowing && messageQueue.length > 0) {
                  isShowing = true;
                  let $text = $('<p></p>');
                  let text = messageQueue.pop();
                  $text.text(text);
                  $text.hide();
                  $('#chat-wrapper').append($text);
                  $text.fadeIn(200).delay(Math.max(3000, text.split(' ').length/130*60000)).fadeOut(200, () => {
                      $text.remove();
                      isShowing = false;
                  });
                  speech.setLanguage('de-DE');
                  speech.setVoice('Microsoft Katja - German (Germany)');
                  speech
                      .speak({
                          text: text,
                          queue: false,
                          listeners: {
                              onstart: () => {},
                              onend: () => {},
                              onresume: () => {},
                              onboundary: event => {}
                          }
                      })
                      .then(data => {
                          isShowing = false;
                      })
                      .catch(e => {
                          isShowing = false;
                      });
              }
          }, 500)
            socket.on('reload', function(msg) {
              location.reload();
          });
      })
      .catch(e => {});*/
}

_init();

function playAudio(text, volume) {
  var audio = document.createElement("audio"); //audio.setAttribute("src", "https://api.streamelements.com/kappa/v2/speech?voice=Joey&text="+text);

  audio.setAttribute("src", "https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text=" + text);
  audio.setAttribute("preload", "auto");
  audio.volume = volume;
  audio.autoplay = true;
  audio.addEventListener('ended', function () {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audio.remove();
  });
  document.getElementById("root").appendChild(audio);
}

var messageQueue = [];
var messageQueueNoText = [];
var isShowing = false;
var socket = io();
socket.on('bot.say', function (msg) {
  messageQueue.push(msg);
});
socket.on('bot.say.notext', function (msg) {
  messageQueueNoText.push(msg);
});
window.setInterval(function () {
  if (!isShowing && messageQueue.length > 0) {
    isShowing = true;
    var $text = $('<p></p>');
    var text = messageQueue.pop();
    $text.text(text);
    $text.hide();
    $('#chat-wrapper').append($text);
    $text.fadeIn(200).delay(Math.max(3000, text.split(' ').length / 130 * 60000)).fadeOut(200, function () {
      $text.remove();
      isShowing = false;
    });
    playAudio(text, 0.5);
  }
}, 500);
window.setInterval(function () {
  if (!isShowing && messageQueueNoText.length > 0) {
    var text = messageQueueNoText.pop();
    playAudio(text, 0.5);
  }
}, 500);
socket.on('reload', function (msg) {
  location.reload();
});
},{"speak-tts":"../node_modules/speak-tts/lib/speak-tts.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52059" + '/');

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
      }); // Enable HMR for CSS by default.

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
  overlay.id = OVERLAY_ID; // html encode message and stack trace

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