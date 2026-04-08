"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const schemaValidators_1 = require("../../lib/validation/schemaValidators");
const hydrationHandler_1 = require("../handlers/hydrationHandler");
const isPastEvent_1 = require("../../lib/utils/isPastEvent");
class EventService {
    db;
    policy;
    hydrate;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
        this.hydrate = new hydrationHandler_1.EventHydrationHandler(this.db);
    }
    async getAllEvents() {
        return await this.db.events.getEvents();
    }
    async searchEvents(query) {
        return await this.db.events.searchEventByTitle(query);
    }
    async getEventById(event_id) {
        return await this.db.events.getEvent(event_id);
    }
    async selectEventsById(ids) {
        return await this.db.events.getEventsByIds(ids);
    }
    async getEventAttendants(event_id) {
        return await this.db.eventAttendants.getAttendants(event_id);
    }
    async updateEventStatus(user_id, eventUpdate) {
        const userId = this.policy.requireAuthenticated(user_id);
        await this.policy.requireCanManageGroup(userId, eventUpdate.group_id);
        return await this.db.events.updateEventStatus(eventUpdate);
    }
    async createEvent(newEvent, group_id, user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        await this.policy.requireCanCreateEvent(userId, group_id);
        return await this.db.events.createNewEvent(newEvent);
    }
    async getGroupEvents(group_id) {
        return await this.db.events.getGroupEvents(group_id);
    }
    async getPastEvents(group_id) {
        const groupEvents = await this.db.events.getGroupEvents(group_id);
        return this.filterCurrentAndFutureEvents(groupEvents);
    }
    async getNextEventLookupMap(ids) {
        const events = await this.db.events.getEventsByGroupIds(ids);
        const eventsByGroup = this.hashEventsByGroup(events);
        return this.mapSoonestEvents(eventsByGroup);
    }
    filterCurrentAndFutureEvents(events) {
        const history = [];
        for (const event of events) {
            const scheduledDate = new Date(event.starts_at_ms);
            if ((0, isPastEvent_1.isPastEvent)(scheduledDate)) {
                history.push(event);
            }
        }
        return history;
    }
    mapSoonestEvents(eventsByGroup) {
        const nextEventLookup = {};
        const values = Object.values(eventsByGroup);
        for (const arr of values) {
            const soonest = this.getNextOrMostRecentGroupEvent(arr);
            nextEventLookup[soonest.group_id] = soonest.starts_at;
        }
        return nextEventLookup;
    }
    hashEventsByGroup(events) {
        const results = {};
        for (const event of events) {
            const groupId = event.group_id;
            if (!results[groupId]) {
                results[groupId] = [];
            }
            results[groupId].push(event);
        }
        return (0, schemaValidators_1.EventsByGroupIdSchemaValidator)(results);
    }
    getNextOrMostRecentGroupEvent(groupEvents) {
        const now = Date.now();
        let nearestFuture = null;
        let nearestPast = null;
        for (const event of groupEvents) {
            const startsAt = new Date(event.starts_at).getTime();
            if (startsAt >= now) {
                if (!nearestFuture ||
                    startsAt < new Date(nearestFuture.starts_at).getTime()) {
                    nearestFuture = event;
                }
            }
            else {
                if (!nearestPast ||
                    startsAt > new Date(nearestPast.starts_at).getTime()) {
                    nearestPast = event;
                }
            }
        }
        if (nearestFuture) {
            return nearestFuture;
        }
        if (nearestPast) {
            return nearestPast;
        }
        throw new Error("Expected at least one event in groupEvents");
    }
}
exports.EventService = EventService;
//# sourceMappingURL=EventService.js.map