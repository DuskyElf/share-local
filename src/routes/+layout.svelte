<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<title>Share Local - QR Based Peer-to-Peer Sharing</title>
	<meta name="description" content="Share data instantly using QR codes." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<link rel="icon" href={favicon} />

	<!-- Twitter (X) metadata -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Share Local - QR Based Peer-to-Peer Sharing" />
	<meta
		name="twitter:description"
		content="Scan a QR code and share data instantly using peer-to-peer WebRTC."
	/>
	<meta name="twitter:image" content="/src/lib/assets/favicon.png" />
	<meta name="twitter:creator" content="@sharelocal" />
</svelte:head>

<ModeWatcher />
<Toaster closeButton richColors />

{@render children()}
