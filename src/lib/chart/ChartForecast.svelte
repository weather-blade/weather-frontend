<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		BarController,
		BarElement,
		TimeScale,
		LinearScale,
		Legend,
		Tooltip,
	} from 'chart.js';
	import type { ChartOptions, ChartData } from 'chart.js';

	import 'chartjs-adapter-date-fns';
	import { cs } from 'date-fns/locale';

	import zoomPlugin from 'chartjs-plugin-zoom';
	import { labelCb, titleCb } from '$lib/chart/chart-tooltip-callbacks';
	import { ChartPluginCrosshair, type CrosshairOptions } from '$lib/chart/chart-plugin-crosshair';
	import { CursorPositioner } from '$lib/chart/chart-positioner-cursor';
	import { chartColors } from '$config/colors';

	export let forecast: IForecast[];

	$: forecast_tempearture = forecast.map((timePoint) => {
		return {
			x: timePoint.time.getTime(),
			y: timePoint.data.instant.details.air_temperature,
		};
	});

	$: forecast_precipitation = forecast.map((timePoint) => {
		const precipitation1hr = timePoint.data?.next_1_hours?.details?.precipitation_amount;
		const precipitation6hr = timePoint.data?.next_6_hours?.details?.precipitation_amount;

		// Preferably use the 1 hour precipitation data. Otherwise use the 6 hour data.
		const precipitation = precipitation1hr ?? precipitation6hr ?? 0;

		if (precipitation1hr === undefined && precipitation6hr === undefined) {
			console.warn('No precipitation data found for: ', timePoint);
		}

		return {
			x: timePoint.time.getTime(),
			y: precipitation,
		};
	});

	const options: ChartOptions<'line' | 'bar'> & { plugins: { crosshair: CrosshairOptions } } = {
		animation: false,
		maintainAspectRatio: false,

		color: chartColors.fontColor,

		scales: {
			x: {
				type: 'time',
				time: {
					displayFormats: { hour: 'HH:mm' },
					minUnit: 'hour',
				},
				adapters: {
					date: {
						locale: cs,
					},
				},

				// no extra whitespace at start and end of x axis
				offset: false,

				grid: {
					color: chartColors.grid,
				},

				ticks: {
					maxTicksLimit: 20,
					color: (c) => (c.tick.major ? chartColors.fontColor : chartColors.fontColorDark),
					major: {
						// major ticks with dates instead of hours
						enabled: true,
					},
				},
			},
			y1: {
				display: 'auto',
				grid: {
					color: chartColors.grid,
				},
				position: 'left',
				title: {
					display: true,
					text: 'Teplota [˚C]',
					color: chartColors.fontColor,
				},

				ticks: {
					color: chartColors.fontColor,
				},
			},
			y2: {
				display: 'auto',
				grid: {
					drawOnChartArea: false,
				},
				position: 'right',
				title: {
					display: true,
					text: 'Srážky [mm]',
					color: chartColors.fontColor,
				},

				ticks: {
					color: chartColors.fontColor,
				},
			},
		},

		interaction: {
			intersect: false, // always show tooltip
			mode: 'index', // show all datasets on tooltip
		},

		plugins: {
			crosshair: {
				horizontal: false,
			},

			legend: {
				onHover: (event: any) => {
					event.native.target.style.cursor = 'pointer';
				},
				onLeave: (event: any) => {
					event.native.target.style.cursor = 'default';
				},
			},

			tooltip: {
				position: 'cursor',
				callbacks: {
					label: labelCb,
					title: titleCb,
				},
			},

			zoom: {
				pan: {
					enabled: true,
					mode: 'x',
				},

				limits: {
					x: {
						min: 'original',
						max: 'original',
					},
					y: {
						min: 'original',
						max: 'original',
					},
				},

				zoom: {
					mode: 'x',
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
				},
			},
		},
	};

	const data: ChartData<'line' | 'bar', { x: number; y: number }[]> = {
		datasets: [
			{
				type: 'line',

				label: 'Teplota',
				data: forecast_tempearture,
				yAxisID: 'y1',

				backgroundColor: chartColors.lineRed,
				borderColor: chartColors.lineRed,

				tension: 0.4,
				pointRadius: 2,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: chartColors.lineRed,
				pointHoverBorderColor: chartColors.lineRed,
			},
			{
				type: 'bar',

				label: 'Srážky',
				data: forecast_precipitation,
				yAxisID: 'y2',

				barThickness: 'flex',
				categoryPercentage: 1,
				barPercentage: 1,

				backgroundColor: chartColors.lineBlue,
				borderColor: chartColors.lineBlue,
			},
		],
	};

	let ctx: HTMLCanvasElement;
	let chartInstance: Chart<'bar' | 'line'>;

	$: if (chartInstance) {
		chartInstance.data.datasets[0].data = forecast_tempearture;
		chartInstance.data.datasets[1].data = forecast_precipitation;
		chartInstance.update();
	}

	onMount(() => {
		Chart.register(
			// line chart
			LineController,
			LineElement,
			PointElement,

			// bar chart
			BarController,
			BarElement,

			TimeScale, // x scale - point are not spread equidistantly
			LinearScale, // y scale

			ChartPluginCrosshair,
			Legend,
			Tooltip,
			zoomPlugin
		);

		Tooltip.positioners.cursor = CursorPositioner;

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data,
			options,
		});
	});
</script>

<div class="min-h-[30vh] rounded border border-zinc-700 bg-zinc-800 p-1">
	<canvas bind:this={ctx} />
</div>

<style>
	@media screen and (max-height: 600px) {
		div {
			/* for mobile landscape mode */
			min-height: 300px;
		}
	}
</style>
