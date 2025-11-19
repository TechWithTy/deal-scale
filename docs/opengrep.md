# Opengrep Static Analysis

Opengrep is a fork of Semgrep that stays open-source under the LGPL 2.1 license.
It aims to keep advanced static analysis accessible for every developer and
organization. The project is backed by a coalition of AppSec vendors (Aikido.dev,
Arnica, Amplify, Endor, Jit, Kodem, Mobb, Orca Security) and welcomes additional
sponsors and contributors. Read the full manifesto at [opengrep.dev](https://opengrep.dev).

## Why we use it

- Ultra-fast, semantic code search across 30+ languages (Apex, Bash, C/C++, C\#, Dart,
  Dockerfile, Elixir, Go, Java, JS/TS/TSX, Kotlin, PHP, Python, Ruby, Rust, Scala,
  Swift, Terraform, YAML, XML, etc.).
- Flexible rule syntax for security findings or custom linting.
- Produces SARIF output that we can archive alongside Lighthouse and coverage reports.

## One-time installation

```bash
curl -fsSL https://raw.githubusercontent.com/opengrep/opengrep/main/install.sh | bash
```

Alternative installation options:

- Clone the repository and run `./install.sh`.
- Download platform-specific binaries from the release page.

## Running scans in this repo

1. Create or configure rule packs (default path: `opengrep-rules/`).
2. Execute the PNPM script:

   ```bash
   pnpm run security:opengrep
   ```

   The script accepts optional environment variables:

   | Variable | Default | Description |
   | --- | --- | --- |
   | `OPENGREP_CMD` | `opengrep` | Custom path or wrapper command |
   | `OPENGREP_RULES` | `opengrep-rules` | Directory or file of rules (`-f` argument) |
   | `OPENGREP_TARGET` | `.` | Path to scan |
   | `OPENGREP_SARIF_OUTPUT` | `reports/security/opengrep/latest-report.sarif` | SARIF output path |

3. The pre-commit hook runs `pnpm run security:scan`, which now includes
   `security:opengrep`. Missing binaries are logged as warnings rather than blocking commits.

## Creating rules (example)

```yaml
# rules/demo-rust-unwrap.yaml
rules:
  - id: unwrapped-result
    pattern: $VAR.unwrap()
    message: "Unwrap detected - potential panic risk"
    languages: [rust]
    severity: WARNING
```

```rust
// code/rust/main.rs
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err("Division by zero".to_string());
    }
    Ok(a / b)
}

fn main() {
    let result = divide(10, 0).unwrap(); // Risky unwrap!
    println!("Result: {}", result);
}
```

Run:

```bash
pnpm run security:opengrep
```

The scan reports the risky unwrap and the SARIF summary is stored under
`reports/security/opengrep/`.

## Archiving results

- `pnpm run archive:opengrep` copies the latest SARIF output into
  `reports/security/history/<yyyy-mm-dd>/opengrep-<timestamp>.sarif`.
- `pnpm run archive:security` runs Trivy, OWASP, and Opengrep archives together.

## Contributing and roadmap

Join the open roadmap sessions or sponsor the initiative via the Opengrep GitHub
repository. Issues and PRs are welcome to expand rule libraries, improve the CLI,
or integrate with additional tooling.










