export type Reading = {
	id: number;
	created_at: Date;

	temperature_bmp: number;
	temperature_dht: number;
	pressure_bmp: number;
	humidity_dht: number;
};
