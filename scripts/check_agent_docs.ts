#!/usr/bin/env bun
/**
 * Agent docs gate — AGENTS.md must exist, every relative link in it must
 * resolve, no harness adapter (CLAUDE.md) remains, and no legacy Cursor rules
 * remain. AGENTS.md is the only agent instruction file.
 *
 * Usage:
 *   bun run scripts/check_agent_docs.ts
 *
 * Exit: 0 = agent docs valid, 1 = violations found
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { exit } from 'node:process'

const PROJECT_ROOT = new URL('..', import.meta.url).pathname
const AGENTS_DOC = 'AGENTS.md'

interface Violation {
  check: string
  filepath: string
  line: number
  message: string
}

const INLINE_LINK = /!?\[[^\]]*\]\(\s*<?([^)>\s]+)>?[^)]*\)/g
const EXTERNAL_TARGET = /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|\/\/|#)/

function findLinks(markdown: string): { target: string; line: number }[] {
  const links: { target: string; line: number }[] = []
  let inFence = false

  const lines = markdown.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:```|~~~)/.test(lines[i])) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    for (const match of lines[i].matchAll(INLINE_LINK)) {
      links.push({ target: match[1], line: i + 1 })
    }
  }

  return links
}

function checkLinks(markdown: string): Violation[] {
  const violations: Violation[] = []

  for (const link of findLinks(markdown)) {
    if (EXTERNAL_TARGET.test(link.target)) continue

    const path = link.target.split(/[?#]/, 1)[0]
    if (!path) continue

    let decoded = path
    try {
      decoded = decodeURIComponent(path)
    } catch {
      // Keep the raw path; it will fail the existence check if invalid.
    }

    const resolved = resolve(PROJECT_ROOT, dirname(AGENTS_DOC), decoded)
    if (!existsSync(resolved)) {
      violations.push({
        check: 'BROKEN_LINK',
        filepath: AGENTS_DOC,
        line: link.line,
        message: `relative link does not resolve: ${link.target}`,
      })
    }
  }

  return violations
}

function checkHarnessAdapters(): Violation[] {
  const claudePath = join(PROJECT_ROOT, 'CLAUDE.md')
  if (!existsSync(claudePath)) return []

  return [
    {
      check: 'HARNESS_ADAPTER',
      filepath: 'CLAUDE.md',
      line: 1,
      message:
        'CLAUDE.md is a harness adapter; AGENTS.md is the only agent instruction file — delete this path',
    },
  ]
}

function checkLegacyRules(): Violation[] {
  const violations: Violation[] = []

  for (const legacy of ['.cursorrules', '.cursor']) {
    if (!existsSync(join(PROJECT_ROOT, legacy))) continue
    violations.push({
      check: 'LEGACY_RULES',
      filepath: legacy,
      line: 0,
      message: 'legacy Cursor rules; fold them into AGENTS.md and delete this path',
    })
  }

  return violations
}

function main(): number {
  const agentsPath = join(PROJECT_ROOT, AGENTS_DOC)
  const violations: Violation[] = []

  if (!existsSync(agentsPath) || statSync(agentsPath).size === 0) {
    violations.push({
      check: 'MISSING_AGENTS_DOC',
      filepath: AGENTS_DOC,
      line: 0,
      message: 'AGENTS.md is required and must not be empty',
    })
  } else {
    violations.push(...checkLinks(readFileSync(agentsPath, 'utf-8')))
  }

  violations.push(...checkHarnessAdapters())
  violations.push(...checkLegacyRules())

  if (violations.length === 0) {
    console.log('Agent docs check passed.')
  }
  for (const v of violations) {
    console.log(`[${v.check}] ${v.filepath}:${v.line} — ${v.message}`)
  }
  console.log(violations.length ? `\n${violations.length} violation(s) found.` : '\n0 violations.')

  return violations.length ? 1 : 0
}

exit(main())
