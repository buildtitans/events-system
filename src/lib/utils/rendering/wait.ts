// Stand in delay for simulating UI transitions, will be removed once code splitting w/lazy loading is implemented
export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));