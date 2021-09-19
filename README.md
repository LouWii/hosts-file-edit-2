# Hosts File Edit 2

Small electron app to easily edit your hosts file. Currently supports Linux (tested on Kubuntu 21.04) and Windows (tested on win10).

## Security

Editing the hosts file requires admin/root permissions. The app uses commands to update the file and will ask for admin access when saving the changes to the file. I'm using [sudo-prompt](https://www.npmjs.com/package/sudo-prompt) for this, which is one of the most popular package for doing so, with no extra depdencies. I'm hoping this is safe enough for editing the file, without sacrificing usability.

## Privacy

The app does not collect any data whatsoever. Everything is stored in the app itself, no data is going out. Feel free to look at the code and make your own opinion.

## Dev

`npm install`

`npm run watch`

`npm run typecheck`

`npm run lint`

`npm run test`

`npm run compile`