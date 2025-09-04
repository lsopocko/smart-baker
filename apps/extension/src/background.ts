// background.ts
let lastConversion: any = null;

chrome.runtime.onMessage.addListener((msg) => {
    console.log('message in bg script recieved', msg)
    if (msg.type === 'SMART_BAKER_CONVERSIONS') {
        lastConversion = msg.payload;
    }

    if (msg.type === 'GET_CONVERSIONS') {
        console.log('message get conversion recieved, sending lastConversion: ', lastConversion);
        chrome.runtime.sendMessage({ type: 'CONVERTED_INGREDIENTS', payload: { ...lastConversion } });
    }

    return true; // indicate async response
});
