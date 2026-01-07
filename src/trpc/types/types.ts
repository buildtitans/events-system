type ApiPath = '/api'
type Endpoints = '/events' // extend with string unions
type EventsPath = `${ApiPath}${Endpoints}`;

export type { ApiPath, EventsPath }