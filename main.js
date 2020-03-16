decodeMessage = (message) => {
    const selectedMessage = message.selectionText
    const json =  extractJSON(atob(selectedMessage))
    const stringify = JSON.stringify(json, null, 2)
    const copyDecoded = confirm("Copy decoded value? " + stringify)
    if(copyDecoded) {
        var dummy = document.createElement("input")
        document.body.appendChild(dummy)
        dummy.setAttribute("id", "dummy_id")      
        dummy.setAttribute('value', stringify)
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
    }

}

function extractJSON(str) {
    let firstOpen, firstClose, candidate;
    firstOpen = str.indexOf('{', firstOpen + 1);
    do {
        firstClose = str.lastIndexOf('}');
        if(firstClose <= firstOpen) {
            return null;
        }
        do {
            candidate = str.substring(firstOpen, firstClose + 1);
            try {
                let res = JSON.parse(candidate);
                return [res, firstOpen, firstClose + 1];
            }
            catch(e) {
                console.log('...failed');
            }
            firstClose = str.substr(0, firstClose).lastIndexOf('}');
        } while(firstClose > firstOpen);
        firstOpen = str.indexOf('{', firstOpen + 1);
    } while(firstOpen != -1);
}

chrome.contextMenus.create({
    title: "Decode rabbitmq message",
    contexts:["selection"],
    onclick: decodeMessage
});