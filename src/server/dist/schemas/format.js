"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("@sinclair/typebox/system");
system_1.TypeSystem.Format("date-time", (value) => {
    if (typeof value !== "string")
        return false;
    const t = Date.parse(value);
    if (!Number.isFinite(t))
        return false;
    return /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
});
system_1.TypeSystem.Format("uuid", (value) => {
    if (typeof value !== "string")
        return false;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return isUuid.test(value);
});
system_1.TypeSystem.Format("email", (value) => {
    if (typeof value !== "string")
        return false;
    const v = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v))
        return false;
    if (v.length > 254)
        return false;
    return true;
});
//# sourceMappingURL=format.js.map