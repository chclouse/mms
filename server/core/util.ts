export function encode(functionId: string, ...params: any) {
    return JSON.stringify({
        id: functionId,
        params
    });
}
