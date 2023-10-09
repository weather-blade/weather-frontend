<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
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

	export let readings: IReading[];

	$: readings_temperature_avg = readings.map((reading) => {
		return {
			x: reading.createdAt.getTime(),
			// average value of the 2 sensors
			y: (reading.temperature_BMP + reading.temperature_DHT) / 2,
		};
	});

	$: readings_temperature_BMP = readings.map((reading) => {
		return {
			x: reading.createdAt.getTime(),
			y: reading.temperature_BMP,
		};
	});
	$: readings_temperature_DHT = readings.map((reading) => {
		return {
			x: reading.createdAt.getTime(),
			y: reading.temperature_DHT,
		};
	});
	$: readings_humidity_DHT = readings.map((reading) => {
		return {
			x: reading.createdAt.getTime(),
			y: reading.humidity_DHT,
		};
	});
	$: readings_pressure_BMP = readings.map((reading) => {
		return {
			x: reading.createdAt.getTime(),
			y: reading.pressure_BMP,
		};
	});

	const options: ChartOptions<'line'> & { plugins: { crosshair: CrosshairOptions } } = {
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

				grid: {
					color: chartColors.grid,
				},

				ticks: {
					maxRotation: 0,
					autoSkipPadding: 20,
					color: chartColors.fontColor,
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
					text: 'Relativní vlhkost [%]',
					color: chartColors.fontColor,
				},

				ticks: {
					color: chartColors.fontColor,
				},
			},
			y3: {
				display: 'auto',
				grid: {
					drawOnChartArea: false,
				},
				position: 'right',
				title: {
					display: true,
					text: 'Tlak [hPa]',
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
					modifierKey: 'ctrl',
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
					drag: {
						enabled: true,
					},

					pinch: {
						enabled: true,
					},
				},
			},
		},
	};

	const data: ChartData<'line', { x: number; y: number }[]> = {
		datasets: [
			{
				label: 'Teplota',
				data: readings_temperature_avg,
				yAxisID: 'y1',

				backgroundColor: chartColors.lineRed,
				borderColor: chartColors.lineRed,

				pointRadius: 2,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: chartColors.lineRed,
				pointHoverBorderColor: chartColors.lineRed,
			},
			{
				label: 'Teplota BMP',
				data: readings_temperature_BMP,
				yAxisID: 'y1',
				hidden: true,

				backgroundColor: chartColors.lineYellow,
				borderColor: chartColors.lineYellow,

				pointRadius: 2,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: chartColors.lineYellow,
				pointHoverBorderColor: chartColors.lineYellow,
			},
			{
				label: 'Teplota DHT',
				data: readings_temperature_DHT,
				yAxisID: 'y1',
				hidden: true,

				backgroundColor: chartColors.lineOrange,
				borderColor: chartColors.lineOrange,

				pointRadius: 2,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: chartColors.lineOrange,
				pointHoverBorderColor: chartColors.lineOrange,
			},
			{
				label: 'Vlhkost',
				data: readings_humidity_DHT,
				yAxisID: 'y2',

				backgroundColor: chartColors.lineBlue,
				borderColor: chartColors.lineBlue,

				pointRadius: 2,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: chartColors.lineBlue,
				pointHoverBorderColor: chartColors.lineBlue,
			},
			{
				label: 'Tlak',
				data: readings_pressure_BMP,
				yAxisID: 'y3',
				hidden: true,

				backgroundColor: chartColors.linePurple,
				borderColor: chartColors.linePurple,

				pointRadius: 2,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: chartColors.linePurple,
				pointHoverBorderColor: chartColors.linePurple,
			},
		],
	};

	let ctx: HTMLCanvasElement;
	let chartInstance: Chart<'line'>;

	$: if (chartInstance) {
		chartInstance.data.datasets[0].data = readings_temperature_avg;
		chartInstance.data.datasets[1].data = readings_temperature_BMP;
		chartInstance.data.datasets[2].data = readings_temperature_DHT;
		chartInstance.data.datasets[3].data = readings_humidity_DHT;
		chartInstance.data.datasets[4].data = readings_pressure_BMP;

		chartInstance.update();
	}

	onMount(() => {
		Chart.register(
			// line chart
			LineController,
			LineElement,
			PointElement,

			TimeScale, // x scale - point are not spread equidistantly
			LinearScale, // y scale

			ChartPluginCrosshair,
			Legend,
			Tooltip,
			zoomPlugin
		);

		Tooltip.positioners.cursor = CursorPositioner;

		chartInstance = new Chart(ctx, {
			type: 'line',
			data,
			options,
		});
	});
</script>

<div class="h-full rounded border border-zinc-700 bg-zinc-800 p-1">
	<canvas bind:this={ctx} />
</div>
