<script lang="ts">
	import * as PeerJS from 'peerjs';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import Button from '$lib/components/ui/button/button.svelte';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';

	interface State {
		peerid: string;
		state: 'idle' | 'connected' | 'connecting' | 'disconnected';
	}

	let state: State = {
		peerid: '',
		state: 'idle'
	};

	let peer: PeerJS.Peer;
	let connection: PeerJS.DataConnection | null = null;

	onMount(() => {
		peer = new PeerJS.Peer();

		const peerIdInUrl = new URLSearchParams(window.location.hash.replace('#', '?')).get('peer');

		peer.on('open', (id) => {
			state = { ...state, peerid: id };

			if (peerIdInUrl) {
				state = { ...state, state: 'connecting' };
				const conn = peer.connect(peerIdInUrl);
				handleConnection(conn);
			} else {
				peer.on('connection', handleConnection);
			}
		});

		peer.on('error', (err) => {
			state = { ...state, state: 'disconnected' };
			console.error(err);
			toast.error('Peer error occurred');
		});

		const handleUnload = () => {
			if (connection?.open) {
				connection.close();
			}
		};

		window.addEventListener('beforeunload', handleUnload);

		return () => {
			window.removeEventListener('beforeunload', handleUnload);
			peer.destroy();
		};
	});

	function handleConnection(conn: PeerJS.DataConnection) {
		connection = conn;
		state = { ...state, state: 'connected' };

		conn.on('open', () => {
			toast.success(`Connected to peer ${conn.peer}`);
		});

		conn.on('close', () => {
			state = { ...state, state: 'disconnected' };
			toast.warning('Peer disconnected');
		});

		conn.on('error', (err) => {
			state = { ...state, state: 'disconnected' };
			console.error('Connection error:', err);
			toast.error('Connection lost');
		});
	}

	async function copyLink() {
		if (!state.peerid) {
			toast.error('Peer ID not ready yet');
			return;
		}

		try {
			await navigator.clipboard.writeText(`${window.location.origin}/#peer=${state.peerid}`);
			toast.success('Link copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy link:', err);
			toast.error('Unable to copy link. Please copy manually.');
		}
	}
</script>

<main class="bg-dark-pattern flex min-h-screen flex-col items-center justify-center space-y-6 px-4">
	<div class="flex flex-col items-center">
		<img src="./logo.png" alt="local share logo" width="40" height="40" />

		<div>
			<h1 class="text-center text-3xl font-semibold tracking-tight">Share Local</h1>

			<p class="text-center text-sm text-muted-foreground">
				Scan a QR or share a link to connect peer-to-peer
			</p>
		</div>
	</div>

	<div class="absolute top-4 right-4">
		<ThemeToggle />
	</div>

	<div class="w-full max-w-md">
		<div class="rounded-xl border-3 bg-background px-4 py-10 shadow-sm sm:px-6 sm:py-12">
			{#if state.state === 'connecting'}
				<p class="text-center text-sm text-muted-foreground">Connecting to peer…</p>
			{:else if state.state === 'idle'}
				<div class="flex flex-col items-center gap-4">
					<img
						src="https://randomqr.com/assets/images/randomqr-256.png"
						alt="QR Code"
						class="h-60 w-60 rounded-md border sm:h-80 sm:w-80"
					/>

					<Button onclick={copyLink} disabled={!state.peerid} class="w-60 sm:min-w-80">
						Copy Share Link
					</Button>

					<p class="text-sm text-muted-foreground sm:text-base">
						Share this link or scan the QR to connect
					</p>
				</div>
			{:else if state.state === 'connected'}
				<div class="flex flex-col items-center gap-3 text-center">
					<p class="text-sm font-medium text-green-600 dark:text-green-400">
						Connected successfully
					</p>

					<p class="muted-foreground text-sm sm:text-base">You can now start sharing data</p>

					<Button variant="outline" class="w-full">Coming soon: File Explorer</Button>
				</div>
			{:else if state.state === 'disconnected'}
				<div class="flex flex-col items-center gap-3 text-center">
					<p class="text-sm font-medium text-destructive sm:text-base">Disconnected</p>

					<p class="sm:text-md text-sm text-muted-foreground">
						Please refresh the page to reconnect
					</p>

					<Button onclick={() => window.location.reload()} variant="outline" class="w-full">
						Refresh
					</Button>
				</div>
			{/if}
		</div>
	</div>
</main>
