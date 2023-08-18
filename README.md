# Semi Constant Headers Writer component

This repository contains an external component that can be injected into the [Community Solid Server (CSS)](https://github.com/CommunitySolidServer/CommunitySolidServer/).
It allows to add several semi constant headers by using placeholders in the headers' values.

## Placeholders

The following placeholders are available:

- `{storageRoot}`: The storage root of the user, aka the user's pod base.

## Running the server

Clone this repository, then install the packages

```bash
npm i
```

To run the server with your current folder as storage, use:

```bash
npm run start
```
