# share-local Development Plan

## The Big Idea
We're building share-local to solve that awkward "how do I get this file to you?" moment when someone's right across the room. No cloud uploads, no email attachments, just direct device-to-device sharing.

## Tech Stack Choices
- SvelteKit because we want to learn something modern and it's perfect for static sites
- TailwindCSS to keep styling simple without writing custom CSS
- PeerJS handles the messy WebRTC stuff so we don't have to
- QR codes because they're just magical for connecting devices

## How It Works
- Start with a QR code on screen - that's the invitation.
- Scan it or copy the link, and suddenly both devices are looking at the same file explorer.
- Upload something from your phone, download it on your laptop. Files flow both ways, no questions asked.

## The Build Plan
1. Get SvelteKit running with TailwindCSS
1. Make PeerJS connect two devices (the hard part)
1. Design the protocol for communication between the peers
1. Build the file explorer with upload/download
1. Polish the rough edges and ship to Cloudflare Pages
1. Add QR code magic for easy pairing

## Deployment
Continuous Integration via Cloudflare's CI / CD pipeline, hosting on share-local.pages.dev for now
