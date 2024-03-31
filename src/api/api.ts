export class ReadingsAPI {
	public static apiURL = 'https://weatherapi.bladesheng.com';
	// public static apiURL = 'http://localhost:8080';

	public static async fetchRange(
		// from 24 hours ago (miliseconds)
		start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
		// up until now
		end = new Date()
	) {
		const url = `${ReadingsAPI.apiURL}/api/readings/range?start=${start.toISOString()}&end=${end.toISOString()}`;

		const readings = this.fetchReadings(url);

		return readings;
	}

	public static async fetchLast24h() {
		const url = `${ReadingsAPI.apiURL}/api/readings/24h`;

		const readings = this.fetchReadings(url);

		return readings;
	}

	public static async fetchMonth(year: number, month: number) {
		const url = `${ReadingsAPI.apiURL}/api/readings/month/decimated?year=${year}&month=${month}`;

		const readings = this.fetchReadings(url);

		return readings;
	}

	private static async fetchReadings(url: string) {
		let readings: IReading[] = [];

		try {
			const res = await fetch(url);

			if (!res.ok) {
				throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
			}

			readings = await res.json();
		} catch (error) {
			// fetch throws for network errors (e.g., not connected to the internet)
			console.warn('Fetch network error. Retrieving cached response instead.\n', error);

			try {
				// try to return cached response (whether it's stale or not)
				const res = await fetch(url, {
					cache: 'force-cache',
				});

				readings = await res.json();
			} catch (error) {
				console.error('No cached response was found\n', error);
			}
		}

		this.dateStringsToObjects(readings);

		console.log('readings', readings);
		return readings;
	}

	/**
	 * Convert date strings to date objects
	 */
	private static dateStringsToObjects(readings: IReading[]) {
		for (const reading of readings) {
			reading.createdAt = new Date(reading.createdAt);
		}
	}
}

export class ForecastAPI {
	public static async fetchForecast() {
		const url = `${ReadingsAPI.apiURL}/api/forecast`;

		let dataJson: {
			forecast: IForecast[];
			sunrise: ISunrise | undefined;
		};

		try {
			const res = await fetch(url);

			if (!res.ok) {
				throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
			}

			dataJson = await res.json();
		} catch (error) {
			// fetch throws for network errors (e.g., not connected to the internet)
			console.warn('Fetch network error. Retrieving cached response instead.\n', error);

			try {
				// try to return cached response (whether it's stale or not)
				const res = await fetch(url, {
					cache: 'force-cache',
				});

				dataJson = await res.json();
			} catch (error) {
				console.error('No cached response was found\n', error);

				dataJson = {
					forecast: [],
					sunrise: undefined,
				};
			}
		}

		const forecast = dataJson.forecast;
		const sunriseSunset = dataJson.sunrise;

		// convert date strings to date objects
		for (const timePoint of forecast) {
			timePoint.time = new Date(timePoint.time);
		}

		if (sunriseSunset !== undefined) {
			sunriseSunset.sunrise = new Date(sunriseSunset.sunrise);
			sunriseSunset.sunset = new Date(sunriseSunset.sunset);
		}

		console.log('Forecast: ', forecast);
		console.log('Sunrise: ', sunriseSunset);
		return { forecast, sunriseSunset };
	}

	/**
	 *
	 * @returns Public VAPID key from server or undefined if error occured
	 */
	public static async getVapidKey() {
		try {
			const url = `${ReadingsAPI.apiURL}/api/forecast/push/vapidPublicKey`;

			const res = await fetch(url);

			if (!res.ok) {
				throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
			}

			const key = await res.text();

			return key;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Sends the push subscription to server to be saved in db
	 */
	public static async saveSubscription(subscription: PushSubscription) {
		try {
			const url = `${ReadingsAPI.apiURL}/api/forecast/push/subscribe`;

			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subscription,
				}),
			});

			if (!res.ok) {
				throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
			}
		} catch (error) {
			console.error(error);
			throw new Error();
		}
	}
}
