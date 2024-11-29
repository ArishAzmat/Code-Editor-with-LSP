export const createUrl = (config) => {
    let buildUrl = '';
    if (config.url) {
        // If the config has a 'url' property, treat it as WebSocketUrlString
        const options = config;
        if (!options.url.startsWith('ws://') && !options.url.startsWith('wss://')) {
            throw new Error(`This is not a proper websocket url: ${options.url}`);
        }
        buildUrl = options.url;
    } else {
        // Otherwise, treat it as WebSocketUrlParams
        const options = config;
        const protocol = options.secured ? 'wss' : 'ws';
        buildUrl = `${protocol}://${options.host}`;
        if (options.port !== undefined) {
            if (options.port !== 80) {
                buildUrl += `:${options.port}`;
            }
        }
        if (options.path !== undefined) {
            buildUrl += `/${options.path}`;
        }
        if (options.extraParams) {
            const url = new URL(buildUrl);

            for (const [key, value] of Object.entries(options.extraParams)) {
                url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value.toString());
            }

            buildUrl = url.toString();
        }
    }
    return buildUrl;
};
