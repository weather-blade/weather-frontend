<script lang="ts">
	import SvgIcon from '$lib/SvgIcon.svelte';
	import { base } from '$app/paths';
	import { Utils } from '$utils/functions';
	import { ForecastAPI } from '$api/api';
	import { toast } from 'svelte-french-toast';

	/**
	 * Asks user for notifications consent and registers push notifications subscription
	 */
	async function registerPushNotifications() {
		if (
			!('Notification' in window) ||
			!('PushManager' in window) ||
			!('serviceWorker' in navigator)
		) {
			toast.error('Váš prohlížeč nepodporuje notifikace');
			return;
		}

		try {
			// user has not decided yet - show them prompt
			if (Notification.permission === 'default') {
				const permission = await Notification.requestPermission();
			}

			const permission = Notification.permission;
			// user denied permission or just closed the prompt
			if (permission === 'denied' || permission === 'default') {
				return;
			}

			await createPushSubscription();

			sendTestNotification();
			toast.success('Notifikace byly zapnuty');
		} catch (error) {
			console.error('Failed to register push notifications', error);
			toast.error('Nepodařilo se zapnout notifikace');
		}
	}

	/**
	 * Creates push subscription
	 */
	async function createPushSubscription() {
		try {
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
		} catch (error) {
			console.error('Failed to create push subscription', error);
			throw new Error();
		}
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
