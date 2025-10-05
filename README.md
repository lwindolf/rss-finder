# RSS Finder

A simple web component finding RSS feeds for different sources.

Intended to be embedded into feed reader apps.

## Embed via iframe

    <iframe src="https://lwindolf.github.io/rss-finder" width="100%" height="800px"></iframe>

## Embed as a webcomponent

1. `npm run build`
2. Copy the `www` directory to your code base as `rss-finder`
3. Include the sources 

        <script src="rss-finder/js/vendor/handlebars.min.js"></script>
        <script type="module" src="rss-finder/js/widget.js"></script>

4. Use the `<x-rss-finder icons='rss-finder/icons'>` custom HTML element in your web app.

## Configuration Parameters

The following configuration parameter can be passed to an iframe via query
string or to the web component as attributes. For example

     https://lwindolf.github.io/rss-finder?show-title=false&scheme=web%2Bfeed%3A

or

     <x-rss-finder
        show-title="true"
        use-cors-proxy="true"
        scheme="web+feed:"
        icons="rss-finder/icons">
     </x-rss-finder>

The following parameters are supported

| Parameter         | Description                                                     | Default          |
|-------------------|-----------------------------------------------------------------|------------------|
| show-title        | Whether to add a `<h1>` title                                   | `true`           |
| icon-path         | Path to subscriber icons (adapt it when using as webcomponent)  | `icons`          |
| scheme            | Which URI scheme to trigger for subscriptions                   | `feed:`          |
| use-cors-proxy    | Whether to retry using a CORS proxy when a network error occurs | `false`          |
| cors-proxy        | URL of a cors proxy to use                                      | `https://corsproxy.io/` |

## Privacy considerations

### CORS proxy

Per default `use-cors-proxy` is disabled, so everything happens at the user side. This
is ok for e.g. Electron apps or native apps with embedded browser widgets which can 
disable CORS internally.

If you want to use RSS finder in a pure web app the browser CORS settings will disallow
access to almost all feeds and you will need to enable the cors-proxy. In this case ensure
your users know about the privacy impact (e.g. Cloudflare hosting corsproxy.io potentially 
knowing about the feeds they subscribe to).

### Accessing 3rd party APIs

Some sources access 3rd party APIs for example 

- iTunes
- Mastodon
- BlueSky
- Lemmy