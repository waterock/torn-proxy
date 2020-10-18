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
The proxy returns the best matching native TORN error code + message (`code` and `error`). This lets consumers rely on existing error handling to make it easier to support the proxy.

Three keys are appended if (and only if) the proxy detected the error _before_ the request was forwarded to TORN: `proxy`, `proxy_code` and `proxy_error`.

These are all the possible errors:
  
| code | error | proxy | proxy_code | proxy_error |
| --- | --- | --- | --- | --- |
| 0 | Unknown error | true | 0 | Failed to proxy the request to torn.com |
| 2 | Incorrect Key | true | 1 | Key not found |
| 2 |  Incorrect Key | true | 2 | Key revoked |
| 7 | Incorrect ID-entity relation | true | 3 | Key forbids access to {subject}: {details} |

### Error codes for tornstats.com
Requests to `/tornstats/api.php...` have no `code` in their error response, and the message (in `error`) always starts with "ERROR:".
The same 3 proxy keys are appended, with the `proxy_code` being either 0, 1, or 2.

## Benefits for your users
Since Ched doesn't care much for account privacy when it comes to the API, I thought it best to take matters into my own hands. By supporting proxy keys on your website/app, your users can:

- Easily revoke access without having to change their TORN key everywhere else.
- In the future, define endpoints and selections per key for additional privacy.

## Security
TORN keys are stored encrypted with a secret and an iv in mysql. Proxy keys, which are easily replaced, are stored plain-text. This ensures a fast service with minimal added latency.  

## Questions
See [forum thread](https://www.torn.com/forums.php#/p=threads&f=63&t=16178384).
