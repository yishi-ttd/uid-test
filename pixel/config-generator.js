document.addEventListener('DOMContentLoaded', function(){
    var element = document.getElementById("submitBtn");
    element.addEventListener("click",function(e){
        e.preventDefault();
        let subscriptionId = document.getElementById('subscriptionId');
        let serverPublicKey = document.getElementById('serverPublicKey');
        let advertiserId = document.getElementById('advertiserId');
        let pixelId = document.getElementById('pixelId');
        let cssSelectors = document.getElementById('cssSelectors');
        let detectionEventtype = document.getElementById('detectionEventtype');
        let triggerElements = document.getElementById('triggerElements');
        
        let fields = [subscriptionId, serverPublicKey, advertiserId, pixelId, cssSelectors, detectionEventtype, triggerElements];
        // field verification
        let verified = true;
        for (f of fields) {
            if (f.value == "") {
                alert("Please ensure the following field is filled: " + f.name);
                verified = false;
                break;
            }
        }
        if (verified) {
            var template = `<script src="https://js.adsrvr.org/up_loader.1.1.0.js" type="text/javascript"></script>
        <script defer src="https://cdn.prod.uidapi.com/uid2-sdk-3.2.0.js"></script> 
        <script type="text/javascript"> 
            ttd_dom_ready( function() { 
                window.ttdPixel.enableDebug(); 
                if (typeof TTDUniversalPixelApi === 'function') { 
                    var universalPixelApi = new TTDUniversalPixelApi(); 
                    var uidConfig = { 
                        "subscriptionId": "${subscriptionId.value}", 
                        "serverPublicKey": "${serverPublicKey.value}", 
                        "cssSelectors": ${cssSelectors.value}, 
                        "detectionSubject": ["email"], 
                        "detectionEventType": "${detectionEventtype.value}", 
                        "triggerElements": ${triggerElements.value}, 
                        "detectDynamicNodes": true 
                    } 
                    universalPixelApi.init("${advertiserId.value}", "${pixelId.value}", "https://insight.adsrvr.org/track/up", null, uidConfig);
                } 
            });
        </script>`;

            console.log(template);
            const link = document.createElement("a");
            const file = new Blob([template], { type: 'text/plain' });
            link.href = URL.createObjectURL(file);
            link.download = "config.txt";
            link.click();
            URL.revokeObjectURL(link.href);
        }
    })
}, false);
