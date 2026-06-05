# 瑰宝榜 Tracker · Product Spec

## Purpose

Build a bilingual web application for the 瑰宝榜 monthly scoring system. It lets 策划组 operate scoring, lets 策展人 and 志工 view realtime standings, and provides a public board for monthly and event-day display.

## Product Decision

This project is a complete web system, not only a Google Sheets dashboard.

Phase 1 focuses on foundation and launch:

- Auth and role placeholders
- 17 策展 seed structure
- Public board
- Curator dashboard
- Admin dashboard
- Pledge path placeholder
- Bilingual UI foundation

Phase 2 adds monthly scoring.
Phase 3 adds 风云题 submissions and verdicts.
Phase 4 adds event-day voting and Top 12.

## Human-Facing Terminology

Use 「策展」 in the UI. Avoid 「区」 except when quoting old source material.

Examples:

- 每策展
- 策展名称
- 策展详情
- 策展团队
- Top 12 策展

## Roles

- `public`: read public board and public curation pages; vote during event day.
- `curator`: read own curation details; submit 风云题 evidence; submit peer vote.
- `judge`: enter B1 quality score, content checks, verdicts.
- `admin`: manage users, curations, month close, overrides.

## Scoring

Base score is 100 points per month:

- A 履约: 30
- B 品质: 30
- C 内容深度: 40 cumulative

Wildcard score is 风云加分:

- Jun: 40
- Jul: 60
- Aug: 80
- Sep: 100
- Oct: 120
- Nov: 140
- Dec: 160
- Jan: 180

Monthly total = A + B + C + 风云.
YTD = sum of locked monthly totals.

## UX Principle

The board should make effort visible without turning the system into a humiliation wall. Public views show ranking, score, progress, and highlights. Internal penalty details stay in the 策划组 view.
