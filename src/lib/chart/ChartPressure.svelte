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

	import { labelCb, titleCb } from '$lib/chart/chart-tooltip-callbacks';
	import { ChartPluginCrosshair, type CrosshairOptions } from '$lib/chart/chart-plugin-crosshair';
	import { CursorPositioner } from '$lib/chart/chart-positioner-cursor';
	import { chartColors } from '$config/colors';

	export let readings: IReading[];

	$: readings_pressure_BMP = readings.map((reading) => {
		return {
			x: reading.createdAt.getTime(),
			y: reading.pressure_BMP / 100, // unit conversion from Pa to hPa
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
		},
	};

	const data: ChartData<'line', { x: number; y: number }[]> = {
		datasets: [
			{
				label: 'Tlak',
				data: readings_pressure_BMP,
				yAxisID: 'y1',

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
		chartInstance.data.datasets[0].data = readings_pressure_BMP;
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
			Tooltip
		);

		Tooltip.positioners.cursor = CursorPositioner;

		chartInstance = new Chart(ctx, {
			type: 'line',
			data,
			options,
		});
	});
</script>

<div class="h-2/5 rounded border border-zinc-700 bg-zinc-800 p-1 md:h-full md:w-2/5">
	<canvas bind:this={ctx} />
</div>
