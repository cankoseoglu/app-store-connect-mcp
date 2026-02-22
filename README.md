# App Store Connect MCP Server

The most comprehensive MCP server for the [Apple App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi) — **73 tools** across 20 categories covering apps, versions, localizations, screenshots, builds, TestFlight, provisioning, IAPs, subscriptions, reviews, Game Center, Xcode Cloud, and more.

Built on [`node-app-store-connect-api`](https://github.com/dfabulich/node-app-store-connect-api) which handles JWT auth, chunked uploads, and pagination automatically.

## Quick Start

### 1. Get API Credentials

Create an API key at [App Store Connect → Users and Access → Integrations → Team Keys](https://appstoreconnect.apple.com/access/integrations/api).

You'll need:
- **Issuer ID** (UUID)
- **Key ID** (10-character string)
- **Private Key** (`.p8` file)

### 2. Configure in Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "app-store-connect": {
      "command": "node",
      "args": ["/path/to/app-store-connect-mcp/dist/index.js"],
      "env": {
        "APP_STORE_CONNECT_ISSUER_ID": "your-issuer-id",
        "APP_STORE_CONNECT_KEY_ID": "your-key-id",
        "APP_STORE_CONNECT_PRIVATE_KEY_PATH": "/path/to/AuthKey_XXXXXXXXXX.p8"
      }
    }
  }
}
```

Or pass the key inline:

```json
{
  "env": {
    "APP_STORE_CONNECT_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\n..."
  }
}
```

### 3. Use with npx (after npm publish)

```json
{
  "mcpServers": {
    "app-store-connect": {
      "command": "npx",
      "args": ["-y", "app-store-connect-mcp"],
      "env": {
        "APP_STORE_CONNECT_ISSUER_ID": "your-issuer-id",
        "APP_STORE_CONNECT_KEY_ID": "your-key-id",
        "APP_STORE_CONNECT_PRIVATE_KEY_PATH": "~/.appstoreconnect/private_keys/AuthKey_XXXXXXXXXX.p8"
      }
    }
  }
}
```

## All 73 Tools

### Apps (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_apps` | List all apps, optional bundleId filter | Read-only |
| `get_app` | Get app details + relationships | Read-only |
| `update_app` | Update primaryLocale, contentRightsDeclaration | Idempotent |

### App Store Versions (5)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_versions` | List versions for app, filter by platform/state | Read-only |
| `get_version` | Get version details | Read-only |
| `create_version` | Create new version (platform, versionString) | — |
| `update_version` | Update versionString, releaseType, earliestReleaseDate | Idempotent |
| `delete_version` | Delete a version | Destructive |

### Localizations (4)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_localizations` | List localizations for version | Read-only |
| `get_localization` | Get localization details | Read-only |
| `create_localization` | Create localization for new locale | — |
| `update_localization` | Update description, keywords, whatsNew, etc. | Idempotent |

### Screenshots & Previews (6)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_screenshot_sets` | List screenshot sets for localization | Read-only |
| `create_screenshot_set` | Create set with screenshotDisplayType | — |
| `upload_screenshot` | Reserve + upload + poll for completion | — |
| `delete_screenshot` | Delete single screenshot | Destructive |
| `list_preview_sets` | List app preview sets | Read-only |
| `upload_preview` | Upload app preview video | — |

### Builds (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_builds` | List builds, filter by version/processingState | Read-only |
| `get_build` | Get build details | Read-only |
| `update_build` | Update expired, usesNonExemptEncryption | Idempotent |

### Beta Testing / TestFlight (7)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_beta_groups` | List beta groups for app | Read-only |
| `create_beta_group` | Create new beta group (internal/external) | — |
| `delete_beta_group` | Remove beta group | Destructive |
| `list_beta_testers` | List beta testers, filter by email/group | Read-only |
| `add_tester_to_group` | Add tester to group | — |
| `remove_tester_from_group` | Remove tester from group | Destructive |
| `submit_for_beta_review` | Submit build for TestFlight review | — |

### Bundle IDs & Capabilities (5)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_bundle_ids` | List registered bundle IDs | Read-only |
| `get_bundle_id` | Get bundle ID details | Read-only |
| `register_bundle_id` | Register new bundle ID | — |
| `enable_capability` | Enable capability (push, iCloud, etc.) | — |
| `disable_capability` | Disable capability | Destructive |

### Devices (2)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_devices` | List registered devices | Read-only |
| `register_device` | Register new device | — |

### Certificates (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_certificates` | List signing certificates | Read-only |
| `get_certificate` | Get certificate details | Read-only |
| `revoke_certificate` | Revoke a certificate (irreversible!) | Destructive |

### Provisioning Profiles (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_profiles` | List provisioning profiles | Read-only |
| `create_profile` | Create new profile | — |
| `delete_profile` | Delete profile | Destructive |

### Users & Access (4)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_users` | List team users | Read-only |
| `get_user` | Get user details | Read-only |
| `update_user_roles` | Modify user roles | Idempotent |
| `remove_user` | Remove user from team | Destructive |

### In-App Purchases (4)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_in_app_purchases` | List IAPs for app (v2) | Read-only |
| `get_in_app_purchase` | Get IAP details (v2) | Read-only |
| `create_in_app_purchase` | Create IAP (v2) | — |
| `delete_in_app_purchase` | Delete IAP (v2) | Destructive |

### Subscriptions (5)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_subscription_groups` | List subscription groups | Read-only |
| `create_subscription_group` | Create subscription group | — |
| `list_subscriptions` | List subscriptions in group | Read-only |
| `create_subscription` | Create subscription | — |
| `delete_subscription` | Delete subscription | Destructive |

### Review Submissions (2)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `create_review_submission` | Submit version for App Review | — |
| `list_review_submissions` | List submission status | Read-only |

### App Pricing & Availability (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_app_price_points` | List price points for app | Read-only |
| `list_territories` | List available territories | Read-only |
| `list_app_availabilities` | Check territory availability | Read-only |

### Customer Reviews (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_customer_reviews` | List customer reviews for app | Read-only |
| `get_customer_review` | Get review details | Read-only |
| `create_review_response` | Respond to a review | — |

### Game Center (4)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_game_center_leaderboards` | List leaderboards | Read-only |
| `create_game_center_leaderboard` | Create leaderboard | — |
| `list_game_center_achievements` | List achievements | Read-only |
| `create_game_center_achievement` | Create achievement | — |

### App Clips (2)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_app_clip_default_experiences` | List App Clip experiences | Read-only |
| `update_app_clip_default_experience` | Update experience | Idempotent |

### Xcode Cloud (3)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `list_ci_workflows` | List Xcode Cloud workflows | Read-only |
| `start_ci_build` | Trigger a workflow build | — |
| `list_ci_build_runs` | List build run results | Read-only |

### Age Ratings & Encryption (2)
| Tool | Description | Annotations |
|------|-------------|-------------|
| `get_age_rating_declaration` | Get age rating for version | Read-only |
| `update_age_rating_declaration` | Update age/content ratings | Idempotent |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_STORE_CONNECT_ISSUER_ID` | Yes | Your issuer ID from App Store Connect |
| `APP_STORE_CONNECT_KEY_ID` | Yes | Your API key ID |
| `APP_STORE_CONNECT_PRIVATE_KEY` | One of these | The `.p8` private key contents (with `\n` for newlines) |
| `APP_STORE_CONNECT_PRIVATE_KEY_PATH` | One of these | Path to your `.p8` private key file |

## Security

- All inputs validated with Zod schemas before reaching handlers
- Stack traces are never exposed to clients — only sanitized error messages
- Private keys and secrets are never included in tool responses
- File paths are resolved and sanitized before upload operations
- `console.error()` only — stdout is reserved for the MCP transport

## Development

```bash
npm install
npm run build
npm run dev  # watch mode
```

## License

MIT
