<script lang="ts">
	import './layout.css';

	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster closeButton richColors />

{@render children()}
