export class Utils {
	public static padWithZeroes(originalNumber: number) {
		return String(originalNumber).padStart(2, '0');
	}

	// return padded date in format: hh:mm:ss dd.mm.yyyy
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
