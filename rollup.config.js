import nodeResolve from '@rollup/plugin-node-resolve';

const nr = nodeResolve();

export default [{
	input: 'index.js',
	plugins: [nr],
	output: [{
		file: 'index.cjs',
		format: 'cjs',
	}],
}];
