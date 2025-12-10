import { imports } from '@shgysk8zer0/importmap';
import { checkCacheItem, setCacheItem } from '@aegisjsproject/http-utils/cache.js';
import { addTrustedTypePolicy, addScriptSrc, useDefaultCSP } from '@aegisjsproject/http-utils/csp.js';

addScriptSrc(
	'https://unpkg.com/@aegisjsproject/',
	'https://unpkg.com/@shgysk8zer0/',
);

addTrustedTypePolicy('aegis-sanitizer#html');

export default {
	routes: {
		'/': '@aegisjsproject/dev-server',
		'/favicon.svg': '@aegisjsproject/dev-server/favicon',
	},
	open: true,
	requestPreprocessors: [
		'@aegisjsproject/http-utils/request-id.js',
		checkCacheItem,
	],
	responsePostprocessors: [
		'@aegisjsproject/http-utils/compression.js',
		'@aegisjsproject/http-utils/cors.js',
		useDefaultCSP(),
		(response, { request }) => {
			if (request.destination === 'document') {
				response.headers.append('Link', `<${imports['@shgysk8zer0/polyfills']}>; rel="preload"; as="script"; fetchpriority="high"; crossorigin="anonymous"; referrerpolicy="no-referrer"`);
			}
		},
		setCacheItem,
	],
};
