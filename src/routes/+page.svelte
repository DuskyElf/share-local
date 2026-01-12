<script lang="ts">
	import * as PeerJS from 'peerjs';
	import Button from '$lib/components/ui/button/button.svelte';
	import QRCode from '$lib/components/ui/qr-code/qr-code.svelte';
	import { onMount } from 'svelte';

	interface State {
		peerid: string;
		state: 'idle' | 'connected' | 'connecting' | 'disconnected';
	}

	let state = $state<State>({
		peerid: '',
		state: 'idle'
	});

	function getPeerLink(peerid: string): string {
		return `${window.location.origin}/#peer=${peerid}`;
	}

	onMount(() => {
		const peer = new PeerJS.Peer();

		const peerIdInUrl = new URLSearchParams(window.location.hash.replace('#', '?')).get('peer');

		if (peerIdInUrl) {
			state.state = 'connecting';

			peer.on('open', (id) => {
				console.log('My peer ID is: ' + id);
				state.peerid = id;

				const conn = peer.connect(peerIdInUrl);
				handleConnection(conn);
			});
		} else {
			peer.on('open', (id) => {
				console.log('My peer ID is: ' + id);
				state.peerid = id;

				peer.on('connection', handleConnection);
			});
		}

		peer.on('error', (err) => {
			console.error(err);
			if (state.state === 'connecting') {
				state.state = 'disconnected';
			}
		});
	});

	function handleConnection(conn: PeerJS.DataConnection) {
		state.state = 'connected';
		conn.on('open', () => {
			console.log('Connected to peer: ' + conn.peer);
		});
		conn.on('close', () => {
			state.state = 'disconnected';
			console.log('Connection closed');
		});
		conn.on('error', (err) => {
			state.state = 'disconnected';
			console.error('Connection error: ', err);
		});
	}

	function copyLink() {
		navigator.clipboard
			.writeText(getPeerLink(state.peerid))
			.then(() => {
				// TODO: Replace with a better notification system
				// maybe a toast or a popup
				alert('Link copied to clipboard!');
			})
			.catch((err) => {
				state.state = 'disconnected';
				console.error('Failed to copy link: ', err);
			});
	}
</script>

<h1 class="m-3 text-center text-4xl">Share Local</h1>

<main class="flex flex-col items-center justify-center gap-6">
	{#if state.state === 'connecting'}
		<p>Hold on, connecting...</p>
	{:else if state.state === 'idle'}
		<QRCode value={getPeerLink(state.peerid)} size={256} />
		<Button onclick={copyLink} class="rounded">Copy link</Button>
	{:else if state.state === 'connected'}
		<p>Connected! You can now share data.</p>
		<p>TODO: build the file explorer</p>
	{:else if state.state === 'disconnected'}
		<p>Disconnected. Please refresh the page to try again.</p>
	{/if}
</main>
