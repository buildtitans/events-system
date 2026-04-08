"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const authRouter_1 = require("./routes/authRouter");
const categoriesRouter_1 = require("./routes/categoriesRouter");
const eventsRouter_1 = require("./routes/eventsRouter");
const groupsRouter_1 = require("./routes/groupsRouter");
const groupMembersRouter_1 = require("./routes/groupMembersRouter");
const eventAttendantsRouter_1 = require("./routes/eventAttendantsRouter");
const notificationsRouter_1 = require("./routes/notificationsRouter");
const usersRouter_1 = require("./routes/usersRouter");
exports.appRouter = (0, init_1.router)({
    events: eventsRouter_1.eventsRouter,
    groups: groupsRouter_1.groupsRouter,
    auth: authRouter_1.authRouter,
    categories: categoriesRouter_1.categoriesRouter,
    groupMembers: groupMembersRouter_1.groupMembersRouter,
    eventAttendants: eventAttendantsRouter_1.eventAttendantsRouter,
    notifications: notificationsRouter_1.notificationsRouter,
    users: usersRouter_1.usersRouter,
});
//# sourceMappingURL=router.js.map