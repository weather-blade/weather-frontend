<script lang="ts">
	import SvgIcon from '$lib/SvgIcon.svelte';
	import { base } from '$app/paths';
	import { Utils } from '$utils/functions';
	import { ForecastAPI } from '$api/api';
	import { toast } from 'svelte-french-toast';
	import { toastOpts } from '$lib/toastOptions';

	/**
	 * Asks user for notifications consent and registers push notifications subscription
	 */
	async function registerPushNotifications() {
		if (
			!('Notification' in window) ||
			!('PushManager' in window) ||
			!('serviceWorker' in navigator)
		) {
			toast.error('Váš prohlížeč nepodporuje notifikace', toastOpts.err);
			return;
		}

		try {
			let permission = Notification.permission;
			// user has not decided yet - show them prompt
			if (permission === 'default') {
				permission = await Notification.requestPermission();
			}

			// user denied permission or just closed the prompt
			if (permission === 'denied' || permission === 'default') {
				return;
			}

			await createPushSubscription();

			toast.success('Notifikace byly zapnuty', toastOpts.ok);
		} catch (error) {
			console.error('Failed to register push notifications', error);
			toast.error('Nepodařilo se zapnout notifikace', toastOpts.err);
		}
	}

	/**
	 * Creates push subscription
	 */
	async function createPushSubscription() {
		const SWRegistration = await navigator.serviceWorker.ready;

		const pushSubscriptionExists = await SWRegistration.pushManager.getSubscription();
		if (pushSubscriptionExists) {
			return;
		}

		const publicKey = await ForecastAPI.getVapidKey();
		if (publicKey === undefined) {
			throw new Error('Public VAPID key is required for push subscription');
		}

		const options: PushSubscriptionOptionsInit = {
			userVisibleOnly: true,
			applicationServerKey: Utils.urlBase64ToUint8Array(publicKey),
		};

		const pushSubscription = await SWRegistration.pushManager.subscribe(options);

		await ForecastAPI.saveSubscription(pushSubscription);
	}

	/**
	 * Shows notification - for testing only
	 */
	function sendTestNotification() {
		const title = 'Meteostanice';
		const body = 'Testovací notifikace';
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
	on:click={registerPushNotifications}
	class="flex items-center gap-1 self-end rounded border border-zinc-700 bg-zinc-800 p-1 hover:brightness-110 active:brightness-125"
>
	<span>Zapnout notifikace</span>

	<SvgIcon name="notifications" class="h-5" />
</button>
