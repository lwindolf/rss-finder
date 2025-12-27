TODO:

- Dark Mode support, currently fails when embedding
- Solve subscriber name overflow (switch to non-square layout)

Maybe:

- Fallback Content Extraction
  - HTML XPath extract expressions
  - prerender document
  - show what default extraction paths would extract
  - allow user to change those
  - extra: click on content element

- HTML extractor XLST
  - default paths for title and content
  - optional parameters to pass other selectors
    provided by content extractor GUI 

- API
  - input
    - URL to identify Subscriber class
    - capabilites
      - XPath: yes/no
      - XSLT: yes/no
      - DnD: yes/no
  - output
    - either
      - valid feed url
      - URI + XSLT sheet


Prio Art

Indexes:
- https://podcastindex.org/ only API (non-commercial, API Key)
- https://www.listennotes.com GUI (commerical API)
- iTunes complex GUI (commercial, but without API key)
- https://fyyd.de/ slow GUI, but very visual and simple (no API)
- https://www.podchaser.com/ complex GUI (commercial API)
- https://www.podcast.de/ intuitive GUI (login)
- https://developer.spotify.com/blog/2020-03-20-introducing-podcasts-api  (OAuth2 API, commercial)
- https://openrss.org/
- https://rssgizmos.com/kebber.html
- https://fetchrss.com/source/facebook

Index Integrations:
- Rythmbox
- https://podstation.org/ (Browser Extension)