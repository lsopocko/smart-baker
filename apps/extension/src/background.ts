// background.ts
let lastConversion: any = null;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === 'SMART_BAKER_CONVERSIONS') {
        lastConversion = msg.payload;
    }

    if (msg.type === 'GET_CONVERSIONS') {
        sendResponse(lastConversion);
    }

    return true; // indicate async response
});
