"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sentry = require("@sentry/browser");
var Tracker = /** @class */ (function () {
    function Tracker() {
        var _this = this;
        this.isInitialized = false;
        this.isMatomoInitialized = false;
        this.DNT = navigator.doNotTrack === "1";
        this.track = function () {
            // skip tracking if DNT is enabled, or if things haven't been intiaized
            if (_this.DNT || !_this.isInitialized) {
                return;
            }
            if (_this.matomoIdentifier) {
                var w = window;
                w._paq = w._paq || [];
                var paq_1 = w._paq;
                paq_1.push(["setCustomUrl", window.location.pathname]);
                paq_1.push(["setDocumentTitle", document.title]);
                paq_1.push(["deleteCustomVariables", "page"]);
                paq_1.push(["setGenerationTimeMs", 0]);
                paq_1.push(["trackPageView"]);
                var self_1 = _this;
                if (!_this.isMatomoInitialized) {
                    var siteId_1 = _this.matomoIdentifier.siteId;
                    var hostname_1 = _this.matomoIdentifier.hostname;
                    var script_1 = _this.matomoIdentifier.script || "matomo.js";
                    var tracker_1 = _this.matomoIdentifier.tracker || "matomo.php";
                    paq_1.push(["enableHeartBeatTimer"]);
                    paq_1.push(["enableLinkTracking"]);
                    (function () {
                        var u = "https://" + hostname_1 + "/";
                        paq_1.push(["setTrackerUrl", u + tracker_1]);
                        paq_1.push(["setSiteId", siteId_1]);
                        var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
                        g.type = "text/javascript";
                        g.async = true;
                        g.defer = true;
                        g.src = u + script_1;
                        s.parentNode.insertBefore(g, s);
                        self_1.isMatomoInitialized = true;
                    })();
                }
                else {
                    // run this after the render completes and the DOM is updated
                    setImmediate(function () {
                        paq_1.push(["enableLinkTracking"]);
                    });
                }
            }
            if (_this.gaguesIdentifier) {
                // trigger gaug.es tracker
                var w = window;
                var gauges = w._gauges;
                if (!gauges) {
                    // initialize gaug.es tracker which auto tracks once when loaded
                    w._gauges = w._gauges || [];
                    (function () {
                        var t = document.createElement("script");
                        t.type = "text/javascript";
                        t.async = true;
                        t.id = "gauges-tracker";
                        t.setAttribute("data-site-id", _this.gaguesIdentifier);
                        t.setAttribute("data-track-path", "https://track.gaug.es/track.gif");
                        t.src = "https://d2fuc4clr7gvcn.cloudfront.net/track.js";
                        var s = document.getElementsByTagName("script")[0];
                        s && s.parentNode && s.parentNode.insertBefore(t, s);
                    })();
                }
                else {
                    gauges.push(["track"]);
                }
            }
        };
        this.logEvent = function (key, value) {
            if (!_this.isInitialized) {
                return;
            }
            if (_this.matomoIdentifier) {
                var paq = window._paq;
                if (paq) {
                    paq.push(["trackEvent", key, value]);
                }
            }
        };
        this.setUser = function (userId) {
            if (!_this.isInitialized) {
                return;
            }
            if (_this.matomoIdentifier) {
                var w = window;
                w._paq = w._paq || [];
                var paq = w._paq;
                paq.push(["setUserId", userId]);
            }
            if (_this.sentryDSN) {
                Sentry.setUser({ id: userId });
            }
        };
        this.clearUser = function () {
            if (!_this.isInitialized) {
                return;
            }
            if (_this.matomoIdentifier) {
                var w = window;
                w._paq = w._paq || [];
                var paq = w._paq;
                paq.push(["resetUserId"]);
            }
            if (_this.sentryDSN) {
                Sentry.configureScope(function (scope) { return scope.clear(); });
            }
        };
        this.setCustom = function (values, scope) {
            if (scope === void 0) { scope = "visit"; }
            if (!_this.isInitialized) {
                return;
            }
            if (_this.matomoIdentifier) {
                var w = window;
                w._paq = w._paq || [];
                var paq = w._paq;
                var index = 1;
                for (var key in values) {
                    paq.push(["setCustomVariable", index++, key, values[key], scope]);
                }
            }
        };
        this.log = console.info.bind(console) ||
            console.log.bind(console) ||
            function () {
                return;
            };
    }
    Tracker.prototype.init = function (options) {
        if (options.ignoreDNT) {
            this.DNT = false;
        }
        if (this.DNT) {
            this.log("I respect your decision to be not tracked. Analytics & error tracking have been");
            this.log("disabled. Learn more about DNT: https://en.wikipedia.org/wiki/Do_Not_Track");
            this.log("Sincerely, " + window.location.origin);
            this.isInitialized = true;
            return;
        }
        this.matomoIdentifier = options.matomoIdentifier;
        this.gaguesIdentifier = options.gaugesIdentifier;
        // initialize Sentry.io
        if (!this.DNT && options.sentryDSN) {
            this.sentryDSN = options.sentryDSN;
            if (options.sentryRelease) {
                Sentry.init({ dsn: options.sentryDSN, release: options.sentryRelease });
            }
            else {
                Sentry.init({ dsn: options.sentryDSN });
            }
        }
        this.isInitialized = true;
    };
    return Tracker;
}());
exports.analytics = new Tracker();
