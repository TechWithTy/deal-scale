# GitHub Actions Library

This directory houses shared composite actions and helper scripts used across the Deal Scale workflows. Place each action in its own subdirectory with an `action.yml` plus any supporting files (scripts, templates, etc.).

### Available Actions

| Action | Description | Key Inputs |
| --- | --- | --- |
| `notify-slack` | Sends a formatted Slack webhook message with status coloring, optional channel overrides, and markdown support. | `webhook`, `message`, `status`, `title` |
| `pager-alert` | Triggers or updates a PagerDuty incident via the Events API v2 with optional custom details. | `routing_key`, `summary`, `source`, `severity` |
| `twilio-vapi` | Dispatches Twilio SMS alerts or initiates voice calls that can hand off to a VAPI assistant. | `account_sid`, `auth_token`, `from_number`, `to_number`, `mode`, `sms_body`/`vapi_url` |

### Structure example

```
.github/actions/
  notify-slack/
    action.yml
  pager-alert/
    action.yml
  twilio-vapi/
    action.yml
```

Document usage and inputs for each action directly inside its `action.yml` to keep the workflows concise.

