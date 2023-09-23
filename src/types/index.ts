import type { Reading } from './readings';
import type { Forecast, Sunrise } from './forecast';

declare global {
	type IReading = Reading;
	type IForecast = Forecast;
	type ISunrise = Sunrise;
}
