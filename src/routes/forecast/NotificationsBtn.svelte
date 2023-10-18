<script lang="ts">
	import SvgIcon from '$lib/SvgIcon.svelte';
	import { base } from '$app/paths';

	async function notifyMe() {
		if (!('Notification' in window)) {
			alert('Váš prohlížeč nepodporuje notifikace');
		} else if (Notification.permission === 'granted') {
			sendTestNotification();
		} else if (Notification.permission !== 'denied') {
			const permission = await Notification.requestPermission();

			if (permission === 'granted') {
				sendTestNotification();
			}
		}
	}

	function sendTestNotification() {
		const title = 'Notifications enabled';
		const body = 'Hello there!';
		const icon = `${base}/icons/icon-main.svg`;
		const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

		const notification = new Notification(title, {
			body,
			icon,
		});

		notification.addEventListener('click', (e) => {
			window.open(url);
		});
	}
</script>

<button
	on:click={notifyMe}
	class="flex items-center gap-1 self-end rounded border border-zinc-700 bg-zinc-800 p-1 hover:brightness-110 active:brightness-125"
>
	<span>Zapnout notifikace</span>

	<SvgIcon name="notifications" class="h-5" />
</button>
