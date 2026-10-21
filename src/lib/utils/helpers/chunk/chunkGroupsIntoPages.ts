

function chunkGroupsIntoPages<T>(groups: T[], size: number = 6): T[][] {
    const chunked: T[][] = []

    for (let i = 0; i < groups.length; i += size) {

        const chunk: T[] = groups.slice(i, i + size);

        chunked.push(chunk);
    }

    return chunked;
};

export { chunkGroupsIntoPages };