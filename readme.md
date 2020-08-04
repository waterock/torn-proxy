# torn-proxy.com
Lets players of TORN.com create purpose-specific API keys that can be easily revoked.

## For developers
Supporting proxy keys on your website/app is incredibly easy.

1. Prompt user for their torn-proxy.com key (it's always a 32-char hex key - TORN keys are 16 chars long).
1. Instead of fetching data from torn.com, change your base url to `http://torn-proxy.com`
1. For the `key` param, use the proxy key instead of the TORN key.

## How it works
- The proxy server internally swaps the key with the actual TORN key and forwards the request to torn.com (without changing anything else).
- The response is exactly what you'd get from torn.com's API. The proxy is just a simple pass-through.

## Error codes
- The proxy server returns error code 2 ("Incorrect key") if the supplied key is not a valid proxy key. In addition to torn's native `code` and `error` keys, there's also `proxy: true` to indicate that it's a proxy error and not a native torn error.    

## Benefits for your users
Since Ched doesn't care much for account privacy when it comes to the API, I thought it best to take matters into my own hands. By supporting proxy keys on your website/app, your users can:

- Easily revoke access without having to change their TORN key everywhere else.
- In the future, define endpoints and selections per key for additional privacy.

## Security
TORN keys are stored encrypted with a secret and an iv in mysql. Proxy keys, which are easily replaced, are stored plain-text. This ensures a fast service with minimal added latency.  

## Questions
Either use Discord (https://discord.gg/cqpTKA) or contact Sulsay [2173590] directly.
