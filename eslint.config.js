import { node } from '@shgysk8zer0/eslint-config';

export default node({ files: ['**/*.js'], ignores: ['**/*.min.js', '**/*.cjs', '**/*.mjs'] });
