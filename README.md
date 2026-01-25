# RSS Finder

A simple web component finding RSS feeds for different sources that can be embedded in feed readers.

Intended embedded use cases:

| Use Case                              | Embed Type    | Used by  |
|---------------------------------------|---------------|----------|
| Progressive web app RSS reader        | web component | lzone.de |
| Native RSS app with browser widget    | website       | Liferea  |
| Native RSS app without browser widget | launch in default browser | |
 
## Embed as website

In a native app open a HTML widget and launch the URL

    https://lwindolf.github.io/rss-finder?show-title=false
    

If possible do disable CORS, if it is not possible enable the CORS proxy by adding
`use-cors-proxy=true` to the query string. 

If your app does not `feed:` as protocol handler set a `scheme` value in the query string.

If your app does not have a browser widget you can still provide a menu option
like "Discover Feeds" and open the the RSS Finder URL using Linux `xdg-open` or the 
corresponding GUI toolkit method to launch RSS Finder in the users default browser.
Your app will receive the subscribed feed URLs via the defined URI scheme.

## Embed as a web component

1. `git submodule init` and `git submodule update`
1. `npm run build`
2. Copy the `www` directory to your code base as `rss-finder`
3. Include the sources 

       <script src="rss-finder/js/vendor/handlebars.min.js"></script>
       <script type="module" src="rss-finder/js/widget.js"></script>

4. Use the custom HTML element in your web app.

       <x-rss-finder icons="rss-finder/icons" subscribe-method="event" use-cors-proxy="true">

5. Register an subscribe event handler

       document.querySelector('x-rss-finder').addEventListener('rss-finder-subscribe', (ev) => {
          alert(`Subscribing to feed URL ${ev.detail.url}`);
       });

Note: due to "web+" custom protocol handlers not working together with CSP and CORS
when used as a web component `subscribe-method` needs to be `event`.

## Configuration Parameters

Configuration parameters are to be passed by query string for iframe embedding or by 
by attribute when including as web component. The following parameters are supported:

| Parameter         | Description                                                     | Default          |
|-------------------|-----------------------------------------------------------------|------------------|
| show-title        | Whether to add a `<h1>` title                                   | `true`           |
| icon-path         | Path to subscriber icons (adapt it when using as webcomponent)  | `icons`          |
| scheme            | Which URI scheme to trigger for subscriptions                   | `feed:`          |
| use-cors-proxy    | Whether to retry using a CORS proxy when a network error occurs | `false`          |
| cors-proxy        | URL of a cors proxy to use                                      | `https://corsproxy.io/?url=` |
| subscribe-method  | How to subscribe (via `location` using the define schema or via `event`) | `location` |

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

Some subscriber access 3rd party APIs:

- iTunes
- Mastodon
- BlueSky
- Lemmy

Any search will be exposed to those providers.