"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkEventsIntoPages = chunkEventsIntoPages;
function chunkEventsIntoPages(events, maxPageLength = 6) {
    const pages = [];
    for (let i = 0; i < events.length; i += maxPageLength) {
        pages.push(events.slice(i, i + maxPageLength));
    }
    return pages;
}
//# sourceMappingURL=chunkIntoPages.js.map