<script lang="ts">
	import QRious from 'qrious';

	interface Props {
		value: string;
		size: number;
	}

	const { value, size }: Props = $props();

	function renderQrCode(canvas: HTMLCanvasElement) {
		new QRious({ element: canvas, value, size });
	}
</script>

<canvas {@attach renderQrCode} class="rounded-lg border border-gray-200 dark:border-gray-700"
></canvas>
