const click = 'click';
const clickoutName = 'clickout';
const windowClickHandlers = [];
let clickoutEvent;

// trigger custom
if (window.CustomEvent && typeof window.CustomEvent === 'function') {
    clickoutEvent = new CustomEvent(clickoutName);
} else {
    clickoutEvent = document.createEvent('CustomEvent');
    clickoutEvent.initCustomEvent(clickoutName, true, true);
}

const protoAddEventListener = Element.prototype.addEventListener;
Element.prototype.addEventListener = function (type, handler, ...args) {
    if (type === clickoutName) {
        const clickedOutElement = this;
        const windowHandler = function(event) {
            if (this !== clickedOutElement || event.target !== this){
                clickedOutElement.dispatchEvent(clickoutEvent);
            }
        };
        windowClickHandlers.push({
            h: handler,
            wh: windowHandler,
            el: clickedOutElement
        });
        window.addEventListener(click, windowHandler);
    }

    //We execute normal addEventListener as always
    protoAddEventListener(type, handler, ...args);
};

const protoRemoveEventListener = Element.prototype.removeEventListener;
Element.prototype.removeEventListener = function (type, handler, ...args) {
    if (type === clickoutName) {
        const clickedOutElement = this;
        const windowhandlerData = windowClickHandlers.find(wd => wd && wd.h === handler && wd.el === clickedOutElement);
        if (windowhandlerData && windowhandlerData.wh) {
            window.removeEventListener(click, windowhandlerData.wh);
            windowClickHandlers = windowClickHandlers.filter(wd => !(wd && wd.h === handler && wd.el === clickedOutElement));
        }
    }

    //We execute normal removeEventListener as always
    protoRemoveEventListener(type, handler, ...args);
}

