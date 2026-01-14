# Project Context

## Overview

share-local enables direct device-to-device file sharing via QR codes or links, no cloud required.

**Live URL**: https://share-local.pages.dev/

## Tech Stack

- **Svelte 5** with runes (`$state`, `$props`, `$bindable`)
- **SvelteKit** with static adapter for Cloudflare Pages
- **Tailwind CSS 4** with `tailwind-variants`
- **PeerJS** for WebRTC peer connections
- **QRious** for QR code generation

## Key Architecture

- **Static SPA**: Uses `adapter-static` with `fallback: 'index.html'`
- **Hash-based peer linking**: Peer ID passed via URL hash (`#peer=xyz`)
- **Connection state machine**: `idle → connecting → connected → disconnected`
- **UI Components**: Custom Button, QR Code, Theme Toggle (mode-watcher), Sonner toast notifications

---

You should use the Svelte MCP server for Svelte 5/SvelteKit documentation (`list-sections`, `get-documentation`), code analysis (`svelte-autofixer`), and playground links. Always run `svelte-autofixer` before sending Svelte code to the user.
