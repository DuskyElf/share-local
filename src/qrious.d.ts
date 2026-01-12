declare module 'qrious' {
	interface QRiousOptions {
		element?: HTMLCanvasElement | HTMLImageElement;
		value?: string;
		size?: number;
		background?: string;
		backgroundAlpha?: number;
		foreground?: string;
		foregroundAlpha?: number;
		level?: 'L' | 'M' | 'Q' | 'H';
		mime?: string;
		padding?: number;
	}

	class QRious {
		constructor(options?: QRiousOptions);
		element: HTMLCanvasElement | HTMLImageElement;
		value: string;
		size: number;
		toDataURL(mime?: string): string;
	}

	export default QRious;
}
