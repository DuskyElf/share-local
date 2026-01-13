<script lang="ts">
	import './layout.css';

	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Basic / SEO -->
	<title>Share Local - QR Based Peer-to-Peer Sharing</title>
	<meta name="description" content="Share data instantly using QR codes." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!-- Open Graph (Discord, Facebook, LinkedIn) -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Share Local" />
	<meta property="og:title" content="Share Local - QR Based Peer-to-Peer Sharing" />
	<meta
		property="og:description"
		content="Scan a QR code or share a link to instantly connect and share data peer-to-peer."
	/>
	<meta property="og:url" content="https://share-local.pages.dev/" />
	<meta property="og:image" content="https://share-local.pages.dev/logo.png" />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Share Local - QR Based Peer-to-Peer Sharing" />
	<meta
		name="twitter:description"
		content="Scan a QR code and share data instantly using peer-to-peer WebRTC."
	/>
	<meta name="twitter:image" content="https://share-local.pages.dev/logo.png" />
	<meta name="twitter:creator" content="@sharelocal" />

	<!-- Favicon -->
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<ModeWatcher />
<Toaster closeButton richColors />

{@render children()}
