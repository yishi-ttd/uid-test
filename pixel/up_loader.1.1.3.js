﻿/**
 * Pulled from jQuery.
 * Used to wait for the DOM to load before calling function.
 * Fixes issues if body is not loaded yet; we need to wait.
 */
var ttd_dom_ready = (function () {

    var readyList,
        DOMContentLoaded,
        class2type = {};
    class2type["[object Boolean]"] = "boolean";
    class2type["[object Number]"] = "number";
    class2type["[object String]"] = "string";
    class2type["[object Function]"] = "function";
    class2type["[object Array]"] = "array";
    class2type["[object Date]"] = "date";
    class2type["[object RegExp]"] = "regexp";
    class2type["[object Object]"] = "object";

    var ReadyObj = {
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function (hold) {
            if (hold) {
                ReadyObj.readyWait++;
            } else {
                ReadyObj.ready(true);
            }
        },
        // Handle when the DOM is ready
        ready: function (wait) {
            // Either a released hold or an DOMready/load event and not yet ready
            if ((wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady)) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (!document.body) {
                    return setTimeout(ReadyObj.ready, 1);
                }

                // Remember that the DOM is ready
                ReadyObj.isReady = true;
                // If a normal DOM Ready event fired, decrement, and wait if need be
                if (wait !== true && --ReadyObj.readyWait > 0) {
                    return;
                }
                // If there are functions bound, to execute
                readyList.resolveWith(document, [ReadyObj]);

                // Trigger any bound ready events
                //if ( ReadyObj.fn.trigger ) {
                //    ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
                //}
            }
        },
        bindReady: function () {
            if (readyList) {
                return;
            }
            readyList = ReadyObj._Deferred();

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if (document.readyState === "complete") {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                return setTimeout(ReadyObj.ready, 1);
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if (document.addEventListener) {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                // A fallback to window.onload, that will always work
                window.addEventListener("load", ReadyObj.ready, false);

                // If IE event model is used
            } else if (document.attachEvent) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                document.attachEvent("onreadystatechange", DOMContentLoaded);

                // A fallback to window.onload, that will always work
                window.attachEvent("onload", ReadyObj.ready);

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch (e) { }

                if (document.documentElement.doScroll && toplevel) {
                    doScrollCheck();
                }
            }
        },
        _Deferred: function () {
            var // callbacks list
                callbacks = [],
                // stored [ context , args ]
                fired,
                // to avoid firing when already doing so
                firing,
                // flag to know if the deferred has been cancelled
                cancelled,
                // the deferred itself
                deferred = {

                    // done( f1, f2, ...)
                    done: function () {
                        if (!cancelled) {
                            var args = arguments,
                                i,
                                length,
                                elem,
                                type,
                                _fired;
                            if (fired) {
                                _fired = fired;
                                fired = 0;
                            }
                            for (i = 0, length = args.length; i < length; i++) {
                                elem = args[i];
                                type = ReadyObj.type(elem);
                                if (type === "array") {
                                    deferred.done.apply(deferred, elem);
                                } else if (type === "function") {
                                    callbacks.push(elem);
                                }
                            }
                            if (_fired) {
                                deferred.resolveWith(_fired[0], _fired[1]);
                            }
                        }
                        return this;
                    },

                    // resolve with given context and args
                    resolveWith: function (context, args) {
                        if (!cancelled && !fired && !firing) {
                            // make sure args are available (#8421)
                            args = args || [];
                            firing = 1;
                            try {
                                while (callbacks[0]) {
                                    callbacks.shift().apply(context, args);//shifts a callback, and applies it to document
                                }
                            }
                            finally {
                                fired = [context, args];
                                firing = 0;
                            }
                        }
                        return this;
                    },

                    // resolve with this as context and given arguments
                    resolve: function () {
                        deferred.resolveWith(this, arguments);
                        return this;
                    },

                    // Has this deferred been resolved?
                    isResolved: function () {
                        return !!(firing || fired);
                    },

                    // Cancel
                    cancel: function () {
                        cancelled = 1;
                        callbacks = [];
                        return this;
                    }
                };

            return deferred;
        },
        type: function (obj) {
            return obj == null ?
                String(obj) :
                class2type[Object.prototype.toString.call(obj)] || "object";
        }
    }
    // The DOM ready check for Internet Explorer
    function doScrollCheck() {
        if (ReadyObj.isReady) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
        }

        // and execute any waiting functions
        ReadyObj.ready();
    }
    // Cleanup functions for the document ready method
    if (document.addEventListener) {
        DOMContentLoaded = function () {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            ReadyObj.ready();
        };

    } else if (document.attachEvent) {
        DOMContentLoaded = function () {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                ReadyObj.ready();
            }
        };
    }
    function ready(fn) {
        // Attach the listeners
        ReadyObj.bindReady();

        var type = ReadyObj.type(fn);

        // Add the callback
        readyList.done(fn);//readyList is result of _Deferred()
    }
    return ready;
})();

var ttd_up_api = {
    // remember referrer default, private variables via just
    // returning a public interface from a function call
    // didn't seem to work properly in GTM
    topLevelUrl: "",

    // provide ability to set default referrer
    set_top_level_url: function (url) {
        this.topLevelUrl = url;
    },

    // normal pixel init without requiring to use new as caller
    init: function (adv, tag_ids, base_src, dyn_params) {
        // use provided referrer fallback for instantiation
        var pxInst = new TTDUniversalPixelApi(this.topLevelUrl);
        pxInst.init(adv, tag_ids, base_src, dyn_params);
    }
};

//Define the TTDUniversalPixelApi object.
function TTDUniversalPixelApi(optionalTopLevelUrl) {
    //Make sure this matches with the loader script version and
    //corresponding universal_pixel.<upLoaderScriptVersion>.js exists.
    var upLoaderScriptVersion = "1.1.3";

    this.getVersion = function () {
        return upLoaderScriptVersion;
    };

    // universal_pixel.js
    this.init = function (adv, tag_ids, base_src, dyn_params) {

        // Context: The signature for init used to be (adv, tag_ids, base_src, verifyCallback, dyn_params)
        //          We removed verifyCallback (a string), but we still have this function be called out in the wild
        //          To make everyone happy we just remove the fourth argument if it's a string, and move the fifth
        //          argument (dynamic parameters) into its spot. At this point, the arguments match up with the signature. 
        if (typeof arguments[3] === 'string') {
            arguments[3] = null;
            if (arguments.length > 4){
                for (var i=4; i<arguments.length; i++){
                    arguments[i-1] = arguments[i];
                }
            }
        }

        if (!adv || adv == "" || !tag_ids || tag_ids.length <= 0) {
            return;
        }

        var embedElem = document.getElementsByTagName('body')[0];
        if (!embedElem) {
            return;
        }

        var src_with_params = "";

        var paramMap = {
            "MonetaryValue": "v",
            "MonetaryValueFormat": "vf"
        };

        var optionalParams = [];

        if (typeof (_pixelParams) !== 'undefined') {
            for (var i in _pixelParams) {
                var value = _pixelParams[i];
                var key = paramMap[i];

                // Make sure we have a valid key and value
                // Also check that the value doesn't match the macro replacement format
                if (key && value && !(/%%.*%%/i.test(value)))
                    optionalParams.push(key + "=" + encodeURIComponent(value));
            }
        }

        var advParam = "adv=" + adv;
        var upParams = "upid=" + tag_ids.join(",");

        // Use the given toplevel url or try to figure it out ourself
        var ref = optionalTopLevelUrl || TryFindTopMostReferrer();

        src_with_params = base_src
            + "?" + advParam
            + "&ref=" + encodeURIComponent(ref)
            + "&" + upParams
            //This is the script version adn should always match the version of the loader script.
            + "&upv=" + this.getVersion();

        if (dyn_params) {
            for(var param in dyn_params) {
                src_with_params = src_with_params + "&" + param + "=" + dyn_params[param];
            }
        }

        if (optionalParams.length > 0)
            src_with_params = src_with_params + "&" + optionalParams.join("&");

        // 
        // GDPR Alert!
        // if we are executing on a page that has integrated with a Consent Management Provider (CMP), then we need to wait until
        // user consent has been gathered, either via an onscreen consent screen or a cache cookie from a previously shown consent screen. the CMP code is
        // responsible for doing this and we can count on a standard __cmp function to exist if the page has loaded a CMP. once consent is available
        // we get called in a callback that can then fire the pixel. if there's no CMP, then we fire the pixel right away
        // https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md#CMP-JS-API
        //
        var pingRequestTimeout = null;
        var pingRequestHasTimedOut = false;
        var requestStartTime = null;

        if (typeof(__tcfapi) === 'function') {
            listenToCmpAndFirePixel();
        }
        else if (typeof (__cmp) === 'function') {
            pingCmpAndFirePixel();
        }
        else if (typeof (__gpp) === 'function') {
            listenToGppAndFirePixel()
        }
        else {
            firePixel();
        }

        var listenToGppRequestTimeout = null;
        function listenToGppAndFirePixel() {
            // https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md
            var gppObject = getGppStringAndApplicableSections();
            if (typeof gppObject.gppString !== 'undefined') {
                firePixelGpp(gppObject.gppString, gppObject.gppSid);
                return;
            }

            listenToGppRequestTimeout = setTimeout(listenToGppTimeout, 1000);
            __gpp('addEventListener', listenToGppCallback);
        }

        function getGppStringAndApplicableSections() {
            var gppData = __gpp('getGPPData');
            // version 1.0
            var gppObject = {
                gppString: gppData?.gppString,
                gppSid: gppData?.applicableSections?.join(",")
            }
            if (typeof gppObject.gppString === 'undefined') {
                // version 1.1
                var gppPing = __gpp('ping');
                gppObject.gppString = gppPing?.gppString;
                gppObject.gppSid = gppPing?.applicableSections?.join(",");
            }
            return gppObject;
        }

        var listenToGppRequestHasTimedOut = false;
        function listenToGppTimeout() {
            listenToGppRequestHasTimedOut = true;
            firePixel();
        }

        function listenToGppCallback(evt, success) {
            if (listenToGppRequestHasTimedOut) {
                __gpp('removeEventListener', function(){}, evt.listenerId);
                return;
            }

            if (evt.eventName !== 'signalStatus' || evt.data !== 'ready') {
                return;
            }
            var gppObject = getGppStringAndApplicableSections();
            clearTimeout(listenToGppRequestTimeout);
            requestStartTime = new Date();
            firePixelGpp(gppObject.gppString, gppObject.gppSid)
            __gpp('removeEventListener', function(){}, evt.listenerId);
        }

        function pingCmpAndFirePixel() {
            pingRequestTimeout = setTimeout(pingCmpTimeout, 1000);
            __cmp('ping', null, pingCmpCallback);
        }

        function pingCmpTimeout() {
            pingRequestHasTimedOut = true;
            firePixel();
        }

        function pingCmpCallback(pingResult) {
            if (pingRequestHasTimedOut) {
                // The timeout callback will fire the pixel for us
                return;
            }

            if (pingResult.cmpLoaded || pingResult.gdprAppliesGlobally) {
                // If GdprAppliesGlobally is true, the best we can do is be queued and wait
                clearTimeout(pingRequestTimeout);
                requestStartTime = new Date();
                __cmp('getConsentData', null, firePixel);
            }
            else {
                // The cmp hasn't loaded yet, keep trying with 200ms delay
                setTimeout(function() { __cmp('ping', null, pingCmpCallback); }, 200);
            }
        }

        function firePixel(cmpResult) {
            if (requestStartTime != null) {
                src_with_params = src_with_params + "&ret=" + (new Date() - requestStartTime);
            }

            function getGdprAppliesParam(gdprApplies) {
                return gdprApplies ? "1" : "0";
            }

            if (pingRequestHasTimedOut) {
                src_with_params = src_with_params + "&pto=1"
            }

            if (cmpResult != null) {
                src_with_params = src_with_params +
                    "&gdpr=" +
                    getGdprAppliesParam(cmpResult.gdprApplies) +
                    "&gdpr_consent=" +
                    cmpResult.consentData;
            }
            createIFrame()
        }

        function createIFrame() {
            var iFrameId = "universal_pixel_" + tag_ids.join("_");
            var existingElement = document.getElementById(iFrameId);
            do {
                if(existingElement){
                    existingElement.parentElement.removeChild(existingElement);
                }
                existingElement = document.getElementById(iFrameId);
            } while (existingElement)

            var iframe = document.createElement("iframe");
            iframe.setAttribute("id", iFrameId);
            iframe.setAttribute("height", 0);
            iframe.setAttribute("width", 0);
            iframe.setAttribute("style", "display:none;");
            iframe.setAttribute("src", src_with_params);
            iframe.setAttribute("title", "TTD Universal Pixel");

            function addIframe() {
                embedElem.appendChild(iframe);
            }

            if (document.readyState === "complete") {
                setTimeout(addIframe, 0);
            }
            else if (window.addEventListener) {
                window.addEventListener("load", addIframe);
            }
            else if (window.attachEvent) { // Support for IE8 and below
                window.attachEvent("onload", addIframe);
            }
            else {
                addIframe();
            }
        }

        // GDPR V2 Alert!!!
        // https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md
        var listenToRequestTimeout = null;
        var listenToCmpRequestHasTimedOut = false;

        function listenToCmpAndFirePixel() {
            // listenToCmpCallback has 1000 millisecond to succeed otherwise we will time out and fire the pixel
            listenToRequestTimeout = setTimeout(listenToCmpTimeout, 1000);
            __tcfapi('addEventListener', 2, listenToCmpCallback);
        }

        function listenToCmpTimeout() {
            listenToCmpRequestHasTimedOut = true;
            firePixel();
        }

        function listenToCmpCallback(tcData, success) {
            if (listenToCmpRequestHasTimedOut) {
                __tcfapi('removeEventListener', 2, function(success){}, tcData.listenerId);
                return;
            }

            if (success) {
                clearTimeout(listenToRequestTimeout);
                firePixelV2(tcData);
                requestStartTime = new Date();
                __tcfapi('removeEventListener', 2, function(success){}, tcData.listenerId);
                return;
            }
            // Keep listening until timed out
        }

        function firePixelV2(tcData) {
            if (requestStartTime != null) {
                src_with_params = src_with_params + "&ret=" + (new Date() - requestStartTime);
            }

            function getGdprAppliesParam(gdprApplies) {
                return gdprApplies ? "1" : "0";
            }

            if (listenToCmpRequestHasTimedOut) {
                src_with_params = src_with_params + "&pto=1"
            }

            if (tcData != null) {
                src_with_params = src_with_params +
                    "&gdpr=" +
                    getGdprAppliesParam(tcData.gdprApplies) +
                    "&gdpr_consent=" +
                    tcData.tcString;
            }
            createIFrame()
        }

        function firePixelGpp(gppString, gppSid) {
            if (requestStartTime != null) {
                src_with_params = src_with_params + "&ret=" + (new Date() - requestStartTime);
            }

            if (gppString != null) {
                src_with_params = src_with_params +
                    "&gpp_consent=" +
                    gppString;
            }

            if (gppSid != null) {
                src_with_params = src_with_params +
                    "&gpp_sid=" +
                    gppSid;
            }
            createIFrame()
        }
    };
    // Extract a value from the query string of a full url
    function GetQueryStringValue(url, name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Walks up to the top most IFRAME that can still be accessed without violating same-origin
    // policy and retrieves it's document's referrer value which is a URL for the parent window.
    // Before IFRAMEs are traveresed we attempt to read the top.location in case we are in the same
    // domain.
    function TryFindTopMostReferrer() {

        var currentWindow = window;
        var referrerTrace = '';
        var hasError = false;
        try {
            //Accessing the property of the location would either succeed or fail with XSS error.
            if (top.location.href) {
                referrerTrace = top.location.href;
            }
        }
        catch (error) {
            hasError = true;
        }

        if (hasError) {
            while (true) {
                try {
                    //Accessing the property of the document would either succeed or fail with XSS error.
                    referrerTrace = currentWindow.document.referrer;

                    if (window.parent != currentWindow) {
                        currentWindow = window.parent;
                    }
                    else {
                        break;
                    }
                } catch (error) {
                    break;
                }
            }
        }

        // This is a targeted fix for buckmason.com who puts our pixel into multiple levels of
        // iframes that preventing us from getting the real top level url. Fortunately, they put
        // the top level url on the query string of the url we were able to get. Charles 02/2015
        if (-1 < referrerTrace.indexOf('cloudfront.net'))
            referrerTrace = GetQueryStringValue(referrerTrace, 'url') || referrerTrace;

        return referrerTrace;
    }
}
