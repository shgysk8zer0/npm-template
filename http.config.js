import { readFile } from 'node:fs/promises';
import { imports } from '@shgysk8zer0/importmap';

const pkg = JSON.parse(await readFile('./package.json', { encoding: 'utf8' }));

const importmap = JSON.stringify({
	imports: {
		...imports,
		[pkg.name]: pkg.exports['.'].import,
		[`${pkg.name}/`]: './',
	}
});

const sri = async (input) => await Promise.resolve(input)
	.then(json => new TextEncoder().encode(json))
	.then(bytes => crypto.subtle.digest('SHa-384', bytes))
	.then(hash => 'sha384-' + new Uint8Array(hash).toBase64());

const integrity = await sri(importmap);

const headers = new Headers({
	'Content-Type': 'text/html',
	'Content-Security-Policy': `default-src 'self'; style-src 'self' blob:; script-src 'self' https://unpkg.com/@shgysk8zer0/ https://unpkg.com/@kernvalley/ https://unpkg.com/@aegisjsproject/ '${integrity}'; trusted-types aegis-sanitizer#html; require-trusted-types-for 'script';`,
});

export default {
	routes: {
		'/': async (req) => {
			const doc = await readFile('./index.html', { encoding: 'utf8' });
			const request = JSON.stringify({
				url: req.url,
				method: req.method,
				destination: req.destination,
				mode: req.mode,
				cache: req.cache,
				referrer: req.referrer,
				headers: Object.fromEntries(req.headers),
			}, null, 4);

			return new Response(
				doc
					.replaceAll('{{ IMPORTMAP }}', importmap)
					.replaceAll('{{ INTEGRITY }}', integrity)
					.replaceAll('{{ POLYFILLS }}', imports['@shgysk8zer0/polyfills'])
					.replaceAll('{{ REQUEST }}', request),
				{ headers }
			);
		},
		'/favicon.svg': () => {
			const svg = `<svg width="16" height="16" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
				<rect width="10" height="10" x="0" y="0" rx="1" ry="1"  fill="#${crypto.getRandomValues(new Uint8Array(3)).toHex()}"></rect>
			</svg>`;

			return new Response(svg, {
				headers: { 'Content-Type': 'image/svg+xml' },
			});
		}
	},
	open: true,
};
