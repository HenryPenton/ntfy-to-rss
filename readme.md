# NTFY to RSS

This module allows you to listen for messages from NTFY with a webhook, then display the latest of each message in an RSS feed.
The messages must have both a title and a message. Stored messages are keyed by their title meaning that if a new message comes in with the same title then it will overwrite a previously existing one. This was to allow me to store my latest disk usage and core temperatures without duplicates from previous days.

You will require two environment variables to get this project working:

NTFY_TOPIC=<NTFY_TOPIC>
SITE_URL=<SITE_URL>

The site URL is the base of the site where you will host your feed.
