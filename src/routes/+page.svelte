<script lang="ts">
	import * as PeerJS from 'peerjs';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import QrCode from '$lib/components/ui/qr-code/qr-code.svelte';
	import GithubRibbon from '$lib/components/ui/github-ribbon/github-ribbon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';

	import { fireConfetti } from '$lib/confetti';

	type State =
		| {
				state: 'connecting';
		  }
		| {
				state: 'idle';
				peerId: string;
		  }
		| {
				state: 'dialing';
				remotePeerId: string;
		  }
		| {
				state: 'connected';
				connection: PeerJS.DataConnection;
		  }
		| {
				state: 'disconnected';
		  };

	let state = $state<State>({
		state: 'connecting'
	});

	function getPeerLink(peerid: string): string {
		return `${window.location.origin}/#peer=${peerid}`;
	}

	let peer: PeerJS.Peer;
	let connection: PeerJS.DataConnection | null = null;

	onMount(() => {
		peer = new PeerJS.Peer();

		// check if we are joining an existing peer via URL
		const peerIdInUrl = new URLSearchParams(window.location.hash.replace('#', '?')).get('peer');

		peer.on('open', (id) => {
			if (peerIdInUrl) {
				// auto-connect if peer id exists in URL
				state = { state: 'dialing', remotePeerId: peerIdInUrl };
				const conn = peer.connect(peerIdInUrl);
				handleConnection(conn);
			} else {
				state = { state: 'idle', peerId: id };
				peer.on('connection', handleConnection);
			}
		});

		peer.on('error', (err) => {
			console.error(err);
			toast.error('Peer error occurred');
		});

		// close connection when tab/window closes
		const handleUnload = () => {
			if (connection?.open) {
				connection.close();
			}
		};

		window.addEventListener('beforeunload', handleUnload);

		// cleanup the peer event
		return () => {
			window.removeEventListener('beforeunload', handleUnload);
			peer.destroy();
		};
	});

	function handleConnection(conn: PeerJS.DataConnection) {
		connection = conn;

		let hasCelebrated = false;

		conn.on('open', () => {
			// Prevent duplicate success effects (confettti, toast)
			if (hasCelebrated) return;
			state = { state: 'connected', connection: conn };
			hasCelebrated = true;

			toast.success(`Connected to peer ${conn.peer}`);
			fireConfetti();
		});

		conn.on('close', () => {
			state = { state: 'disconnected' };
			toast.warning('Peer disconnected');
		});

		conn.on('error', (err) => {
			console.error('Connection error:', err);
			toast.error('Connection lost');
		});
	}

	// Copy shareable link to clipboard
	async function copyLink() {
		if (state.state !== 'idle') {
			toast.error('Peer ID not ready yet');
			return;
		}

		try {
			await navigator.clipboard.writeText(`${window.location.origin}/#peer=${state.peerId}`);
			toast.success('Link copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy link:', err);
			toast.error('Unable to copy link. Please copy manually.');
		}
	}
</script>

<main
	class="bg-dark-pattern flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-12"
>
	<!-- Header -->
	<div class="flex flex-col items-center gap-3">
		<img src="/logo.png" alt="local share logo" class="size-10" />

		<div class="space-y-1 text-center">
			<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Share Local</h1>

			<p class="max-w-xs text-sm text-muted-foreground sm:max-w-none">
				Share files locally with ease, via a link or QR code
			</p>
		</div>
	</div>

	<!-- Theme toggle -->
	<div class="absolute top-4 right-4">
		<ThemeToggle />
	</div>

	<!-- Github ribbon -->
	<GithubRibbon repo="duskyelf/share-local" />

	<!-- Card -->
	<div class="mt-6 w-full max-w-md sm:mt-8">
		<div class="rounded-xl border bg-background px-5 py-8 shadow-sm sm:px-6 sm:py-10">
			{#if state.state === 'connecting'}
				<p class="text-center text-sm text-muted-foreground">Initializing peer…</p>
			{:else if state.state === 'dialing'}
				<p class="text-center text-sm text-muted-foreground">
					Connecting to peer {state.remotePeerId}…
				</p>
			{:else if state.state === 'idle'}
				<div class="flex flex-col items-center gap-5">
					<QrCode value={getPeerLink(state.peerId)} size={256} />

					<Button onclick={copyLink} class="w-full sm:w-70">Copy share link</Button>

					<p class="text-center text-sm text-muted-foreground">
						Share this link or scan the QR to connect
					</p>
				</div>
			{:else if state.state === 'connected'}
				<div class="flex flex-col items-center gap-4 text-center">
					<p class="text-sm font-medium text-green-600 md:text-base dark:text-green-400">
						Connected successfully
					</p>

					<p class="text-sm text-muted-foreground">You can now start sharing data</p>

					<Button variant="outline" class="w-full">Coming soon: File Explorer</Button>
				</div>
			{:else if state.state === 'disconnected'}
				<div class="flex flex-col items-center gap-4 text-center">
					<p class="text-sm font-medium text-destructive">Disconnected</p>

					<p class="text-sm text-muted-foreground">Please refresh the page to reconnect</p>

					<Button onclick={() => window.location.reload()} variant="outline" class="w-full">
						Refresh
					</Button>
				</div>
			{/if}
		</div>
	</div>
</main>
