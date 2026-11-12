# share-local

A static webapp to share files locally peer to peer.

LIVE link: https://share-local.pages.dev/

## Networks

There is no TURN relay. The peer is created with STUN only, so two devices
connect only when they can reach each other directly. Usually that means the
same Wi-Fi, and the router has to allow client to client traffic. Across
networks it still works when nothing in between blocks the connection, for
example global IPv6 addresses with permissive firewalls. A phone behind carrier
NAT will not connect without a relay.

MIT License
