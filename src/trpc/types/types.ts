import type { PaginatedLayoutSchemaType } from "@/src/schemas/layoutSlotSchema";
import type { GroupsSchemaType, GroupSchemaType } from "@/src/schemas/groupSchema";

type ApiPath = "/api";

type RouteToMethods = {
    "/events": "/getEvents"; //extend to other endpoints as new db transactions 
    // are created on the '/events' route (i.e. -> '/events': '/getEvents' | '/newEndpoint'...)
    "/groups": "/getGroups" | "/createGroup";

    "/auth": "/login"
};

type Endpoints = {
    [R in keyof RouteToMethods]: `${ApiPath}${R}${RouteToMethods[R]}`
}[keyof RouteToMethods];

type FastifyServerUrl = "http://localhost:3001"


type EventsResponse = {
    items: PaginatedLayoutSchemaType,
    meta: {
        total: number
    }
}

type GroupsResponse = {
    items: GroupsSchemaType | null,
    meta: {
        total: number
    }
}


type GroupResponse = {
    items: GroupSchemaType | null,
    meta: {
        total: number
    }
}

type LoginBody = {
    input_email: string,
    input_password: string
}

type LoginResponse = boolean;

export type { ApiPath, Endpoints, FastifyServerUrl, EventsResponse, GroupsResponse, LoginBody, LoginResponse, GroupResponse }