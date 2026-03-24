# howoldisminecraft.today

A Cloudflare Worker that tells you how old any version of Minecraft is today.

## Usage

- `howoldisminecraft.today/1.21.1` - How old is 1.21.1?
- `howoldisminecraft.today/b1.7.3` - How old is Beta 1.7.3?
- `howoldisminecraft.today/snapshot` - How old is the latest snapshot?
- `howoldisminecraft.today` - How old is the latest stable release?
- `howoldisminecraft189.today` - Redirects to `/1.8.9` on the main domain

## Development

### Prerequisites

- [pnpm](https://pnpm.io/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/GamingGeek/howoldisminecraft.today.git
   cd howoldisminecraft.today
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Deployment

### Manual Deployment

```bash
pnpm deploy
```

### GitHub Actions

The project is configured to automatically deploy to Cloudflare when changes are pushed to the `master` branch.

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN`: A Cloudflare API token made using the `Edit Cloudflare Workers` template
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE version 3 - see the [LICENSE](LICENSE) file for details.
