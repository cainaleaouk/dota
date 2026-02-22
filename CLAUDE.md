# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dota 2 stats scraper that uses Playwright to scrape match statistics from Dotabuff for a specific player and hero.

## Commands

- **Run scraper**: `pnpm scrape` (runs `tsx src/dotabuff-scraper.ts`)

## Architecture

Single-file TypeScript scraper (`src/dotabuff-scraper.ts`) that:
1. Launches headless Chromium via Playwright
2. Paginates through a player's match history for a specific hero
3. Counts wins/losses by parsing page content
4. Outputs cumulative stats including win rate

Configuration is hardcoded at the top of the file:
- `BASE_URL`: Player's Dotabuff matches page
- `HERO`: Hero to filter matches by
