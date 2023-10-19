export class Utils {
	/**
	 * @param arr array of numbers
	 * @returns average value of that array
	 */
	public static getAvg(arr: number[]) {
		return arr.reduce((acc, curr) => acc + curr) / arr.length;
	}

	/**
	 * @returns original number rounded to certain number of decimal place
	 */
	public static round(originalNumber: number, decimalPlaces: number) {
		const x = 10 ** decimalPlaces;
		return Math.round(originalNumber * x) / x;
	}

	/**
	 * @param originalNumber
	 * @param width how wide should the number be
	 * @returns the original number padded with zeroes
	 */
	public static padWithZeroes(originalNumber: number, width = 2) {
		return String(originalNumber).padStart(width, '0');
	}

	/**
	 * @returns padded date in format: hh:mm:ss dd.mm.yyyy
	 */
	public static padDate(date: Date) {
		const hours = this.padWithZeroes(date.getHours());
		const minutes = this.padWithZeroes(date.getMinutes());
		const seconds = this.padWithZeroes(date.getSeconds());

		const dayOfMonth = this.padWithZeroes(date.getDate());
		const month = this.padWithZeroes(date.getMonth() + 1);
		const year = String(date.getFullYear());

		return { hours, minutes, seconds, dayOfMonth, month, year };
	}

	/**
	 * Returns how many months are there between 2 dates
	 */
	public static monthDiff(dateFrom: Date, dateTo: Date) {
		return (
			dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
		);
	}

	/**
	 * Convert the URL safe base64 string to a Uint8Array
	 * (taken from https://github.com/web-push-libs/web-push)
	 * @param base64String base64 string
	 */
	public static urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = window.atob(base64);
		return Uint8Array.from(Array.from(rawData).map((char) => char.charCodeAt(0)));
	}
}
