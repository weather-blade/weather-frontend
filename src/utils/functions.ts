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
}
