"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
exports.categoriesRouter = (0, init_1.router)({
    getAllCategories: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return ctx.services.api.domains.groups.getGroupCategories();
    }),
});
//# sourceMappingURL=categoriesRouter.js.map