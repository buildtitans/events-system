type ApiPath = '/api'
type Endpoints = '/events' | '/groups' // extend with string unions
type EventsPath = `${ApiPath}${Endpoints}`;
type FastifyServerUrl = "http://localhost:3001" //temp


export type { ApiPath, EventsPath, FastifyServerUrl }