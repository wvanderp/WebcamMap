# Webcam Map

![OSM](https://wiki.openstreetmap.org/w/images/e/e0/Osm_badge.png)
![Made With Love](https://img.shields.io/badge/Made%20With-Love-orange.svg)

![GitHub](https://img.shields.io/github/license/wvanderp/WebcamMap?style=plastic)
![GitHub issues](https://img.shields.io/github/issues-raw/wvanderp/WebcamMap)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/wvanderp/webcamMap)
![GitHub last commit](https://img.shields.io/github/last-commit/wvanderp/webcamMap)

[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](https://forthebadge.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/723c662b-f86b-4d02-be3f-540b94d79b22/deploy-status)](https://app.netlify.com/sites/cartocams/deploys)

## Introduction

This project is a map of webcams around the world. It is based on the OpenStreetMap data. The map is available at [https://cartocams.com/](https://cartocams.com/).

It queries OpenStreetMap via the [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) filters the data and extends the data with an address from the [Nominatim API](https://wiki.openstreetmap.org/wiki/Nominatim). The map is then rendered using the [Leaflet](https://leafletjs.com/) library.

## Installation

run `npm install` to install all the dependencies.

## Usage

run `npm run collect` to collect the data from OpenStreetMap and save it to the `data` folder.

run `npm run app` to start the development server.

## Data sources

We want to thank the OpenStreetMap community for providing the webcam and the address data. The data is available at <https://www.openstreetmap.org/> under the [ODbL](https://creativecommons.org/licenses/by-sa/3.0/) license.

This project uses the OpenStreetMap Logo by Ken Vermette which is licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). It is available from the OpenStreetMap Wiki ([link](https://wiki.openstreetmap.org/wiki/File:Public-images-osm_logo.svg)).

This project also uses the "Icons8 flat integrated webcam" icon from the Icons8 library. These icons are available under the [MIT](https://opensource.org/licenses/MIT) license and available at Wikimedia Commons ([link](https://commons.wikimedia.org/wiki/File:Icons8_flat_integrated_webcam.svg)).

The black directional webcam icon was created by Wikipedia user Waffle5522 and kindly placed in the [public domain (CC0)](https://creativecommons.org/publicdomain/zero/1.0/deed.en) and available at Wikimedia Commons ([link](https://commons.wikimedia.org/wiki/File:Video_camera_icon_svg.svg)).

## Todos

- Preview webcams
- Be able to add webcams directly
- Make icons smaller on higher zoom levels
- Make Creative Commons license visible on the sites
- Look at all the package licenses
- use the cluster plugin
