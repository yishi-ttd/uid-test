"use strict";
let config = {
    "cssSelectors": ["input[type=email]"],
    "detectionSubject": ["email"],
    "detectionEventType": "onclick",
    "triggerElements": ["button.form-submit"]
}

let logLevel = null,
    logCategory = "(TTD)";
const LOG_LEVELS = ["debug", "info", "warn", "error"];
var Logger = LOG_LEVELS.reduce(((e, t, n) => (e[t] = function() {
    const e = "debug" === t ? "log" : t;
    if (logLevel && console && "function" == typeof console[e]) {
        const a = LOG_LEVELS.indexOf(logLevel.toString().toLocaleLowerCase());
        if (!0 === logLevel || a > -1 && n >= a) {
            for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) o[i] = arguments[i];
            const [n, ...a] = [...o];
            console[e](`${t.toUpperCase()} - ${logCategory} ${n}`, ...a)
        }
    }
}, e)), {});

function updateLogLevl(l){
    logLevel = l
}

function startDetection() {
    Logger.info("Detection started! Library is configured to detect: ", config.detectionSubject);
    Logger.info("Detection event type is ", config.detectionEventType);

    let e = [];
    collectInputs(e);
    if("onsubmit" === config.detectionEventType || "onclick" === config.detectionEventType){
    	detectEvent(e);
    }
    else{
    	Logger.debug("Detection type not supported!")
    }
}


// startDetection();

window.ttd={};
window.ttd.startDetection=startDetection;
window.ttd.enableDebug=()=>updateLogLevl("debug");
window.ttd.disableLog=()=>updateLogLevl(null);


function detectEvent(inputs){
	let Z = [];
	!function(){
	    for (let e of config.triggerElements){
	        if (e.length > 0) {
	            document.querySelectorAll(e).forEach((e => {
	                Z.includes(e) || Z.push(e)
	            }));
	        }
	    }
	    let h = window.location.hostname,
	    t = document.getElementsByTagName("iframe");
		for (let n = 0; n < t.length; n++){
			if (canAccessIframe(h, t[n]) && t[n].contentDocument){
			    for (let e of config.triggerElements)
			        if (e.length > 0) {
			            t[n].contentDocument.querySelectorAll(e).forEach((e => {
			                Z.push(e)
			            }))
			        }   
		    }
		}
	}();

	Logger.debug("Z ", Z);

    let t = [];
    for (let n of inputs)
        for (let e of n) e && e.tagName && "INPUT" === e.tagName && t.push(e);
    for (let e = 0; e < Z.length; e++) Z[e][config.detectionEventType] = function() {
        for (let e of t){
            let t = e.value.trim();
            if (foundId(t)) {
                Logger.debug("We detected: ", t);
                break
            }
        }
    }
}

function foundId(e) {
    return foundEmail(e) || foundPhone(e)
}

function foundEmail(e) {
    const g = /((([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,}))/i;
    if (config.detectionSubject.includes("email") && g.test(e)) {
        const t = normalizeEmail(e.match(g)[0]);
        Logger.debug("We detected email: " + t);
        dispatch(t, "email");
        return true;
    }
    return false;
}

function foundPhone(e){
	return false;
}

function normalizeEmail(e){
	return e.toLowerCase().trim();
}


function dispatch(i, t) {
	if(i && t){
	    const e = new CustomEvent("detected-identifier", {
	        detail: {
	            identifier: i,
	            type: t
            }
        });
        Logger.info("Dispatched event with identifier: ", i, " and type: ", t);
		window.dispatchEvent(e);
	}
}

function canAccessIframe(e, t) {
    if (!t.src) return false;
    try {
        const n = e === new URL(t.src).hostname;
        if(n){
        	Logger.debug("Iframe " + t.src + " can be accessed");
        }
        return n;
    } catch (e) {
        Logger.debug("error: ", e)
        return false;
    }
}


function collectInputs(e) {
	for (let t of config.cssSelectors) "string" == typeof t && t.includes("input") && t.length > 0 && e.push(document.querySelectorAll(t));
	let t = window.location.hostname,
	    n = document.getElementsByTagName("iframe");
	for (let i = 0; i < n.length; i++)
	    if (canAccessIframe(t, n[i]) && n[i].contentDocument)
	        for (let t of config.cssSelectors) "string" == typeof t && t.includes("input") && t.length > 0 && e.push(n[i].contentDocument.querySelectorAll(t));
	return e;
}