import type { Toast } from 'svelte-french-toast';

const ok: Partial<Toast> = {
	position: 'bottom-right',
	style: 'background: #52525b; color: #d6d3d1', // zinc-600 stone 300
	iconTheme: {
		primary: '#22c55e', // green-500
		secondary: '#d6d3d1',
	},
};

const err: Partial<Toast> = {
	position: 'bottom-right',
	style: 'background: #52525b; color: #d6d3d1',
	iconTheme: {
		primary: '#ef4444', // red-500
		secondary: '#d6d3d1',
	},
};

export const toastOpts = {
	ok,
	err,
};
