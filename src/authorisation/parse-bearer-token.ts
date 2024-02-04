export function parseBearerToken(headers: { authorization?: string }): string | null {
    const REG_TOKEN = /^Bearer\s+([A-Za-z0-9\-._~+\/]+)=*$/;

    if (!headers.authorization) {
        return null;
    }

    const found = REG_TOKEN.exec(headers.authorization);
    return found ? found[1] : null;
}
