# Cloudflare in front of bushaashegaruwa.com

Cloudflare keeps copies of the website's photos and scripts on fast servers near
visitors, so pages load quickly even when the host (AletCloud) is slow. The website
itself stays on AletCloud; only the domain's DNS moves to Cloudflare.

The API is ready for it: behind Cloudflare it counts each visitor by Cloudflare's
`CF-Connecting-IP` header (`backend/src/http/rate-limit.ts`), so the form spam limit
still works per visitor.

## 1. Add the site to Cloudflare

1. Sign in at https://dash.cloudflare.com (create a free account if needed).
2. **Add a domain**: `bushaashegaruwa.com`, choose **Free**.
3. Cloudflare copies the DNS records it finds. Check them against the list below and
   add any that are missing. Only the first two may have the orange cloud
   (**Proxied**); every other record must be grey (**DNS only**), or email stops working.

| Type  | Name                       | Content                                   | Proxy         |
| ----- | -------------------------- | ----------------------------------------- | ------------- |
| A     | `@`                        | `196.190.212.130`                         | **Proxied**   |
| CNAME | `www`                      | `bushaashegaruwa.com`                     | **Proxied**   |
| CNAME | `send`                     | `send.forge.rmta.net`                     | DNS only      |
| CNAME | `rsend`                    | `rsend-euw1.forge.rmta.net`               | DNS only      |
| CNAME | `autodiscover`             | `mx1.aletcloud.com`                       | DNS only      |
| CNAME | `autoconfig`               | `mx1.aletcloud.com`                       | DNS only      |
| MX    | `@`                        | `mx1.aletcloud.com`, priority 10          | –             |
| MX    | `@`                        | `mx2.aletcloud.com`, priority 20          | –             |
| TXT   | `@`                        | `v=spf1 mx -all`                          | –             |
| TXT   | `@`                        | `google-site-verification=XIZkoCCyWbE6AM92-fxIy-4YviKTCv_JhWDHTZb6aZo` | – |
| TXT   | `resend._domainkey`        | the `p=MIGf…` key (copy from AletCloud DNS) | –           |
| TXT   | `v1-rsa-20260929._domainkey` | the `v=DKIM1; k=rsa; …` key (copy from AletCloud DNS) | – |
| TXT   | `_dmarc`                   | `v=DMARC1; p=reject; rua=mailto:postmaster@bushaashegaruwa.com` | – |
| SRV   | `_submissions._tcp`        | `mx1.aletcloud.com`, priority 0, weight 1, port 465 | –   |
| SRV   | `_imaps._tcp`              | `mx1.aletcloud.com`, priority 0, weight 1, port 993 | –   |
| SRV   | `_pop3s._tcp`              | `mx1.aletcloud.com`, priority 0, weight 1, port 995 | –   |
| SRV   | `_jmap._tcp`               | `mx1.aletcloud.com`, priority 0, weight 1, port 443 | –   |
| SRV   | `_caldavs._tcp`            | `mx1.aletcloud.com`, priority 0, weight 1, port 443 | –   |
| SRV   | `_carddavs._tcp`           | `mx1.aletcloud.com`, priority 0, weight 1, port 443 | –   |

## 2. Settings in Cloudflare

- **SSL/TLS → Overview**: **Full (strict)**. (Not "Flexible": that makes the site
  redirect in a loop.)
- **SSL/TLS → Edge Certificates**: **Always Use HTTPS** on.
- **Speed → Optimization**: **Rocket Loader off** (it breaks the site's security rules).
- **Scrape Shield**: **Email Address Obfuscation off** (it rewrites the email links).
- Leave **Caching** at its defaults: photos and scripts are already marked to be kept
  for a year, and pages are marked not to be kept, so staff edits show at once.

## 3. Point the domain to Cloudflare

Cloudflare shows two nameservers (like `xxx.ns.cloudflare.com`). In the **AletCloud
console → Domains → bushaashegaruwa.com → Nameservers**, replace the four
`haillejegnamachduguma.*.orderbox-dns.com` nameservers with Cloudflare's two. If
DNSSEC is on for the domain at AletCloud, turn it off first.

Cloudflare emails when the domain is active (minutes, at most a day).

## 4. Check

- `curl -sI https://bushaashegaruwa.com/` shows `server: cloudflare` and a `cf-ray` header.
- A photo under `/assets/` shows `cf-cache-status: HIT` on the second request.
- The contact form sends, the confirmation email arrives, staff alerts arrive.
- The AletCloud app still shows the custom domain as healthy (its certificate is
  renewed through Cloudflare). If AletCloud reports a certificate problem, set
  SSL/TLS to **Full** (not strict) until it is fixed.

## Going back

In the AletCloud console, put the four `orderbox-dns.com` nameservers back. The DNS
records at AletCloud are left untouched, so everything works as before.
