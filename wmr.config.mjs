import { defineConfig } from 'wmr';
import OMT from '@surma/rollup-plugin-off-main-thread';

export default defineConfig({
	// eslint-disable-next-line new-cap
	plugins: [OMT({ silenceESMWorkerWarning: true })]
});
