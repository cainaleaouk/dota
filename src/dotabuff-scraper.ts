import { chromium } from "playwright";

const BASE_URL = "https://www.dotabuff.com/players/22707648/matches";
const HERO = "warlock";

async function scrapeMatches() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  let totalWins = 0;
  let totalLosses = 0;
  let currentPage = 1;
  let hasNextPage = true;
  const pageResults: { page: number; wins: number; losses: number }[] = [];

  console.log(`Starting scrape for hero: ${HERO}`);
  console.log("=".repeat(50));

  while (hasNextPage) {
    const url = `${BASE_URL}?hero=${HERO}&page=${currentPage}`;
    console.log(`Scraping page ${currentPage}...`);

    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for the matches table to load
    await page.waitForSelector("table", { timeout: 10000 }).catch(() => null);

    // Count wins and losses on this page
    const wins = await page.locator('a:has-text("Won Match")').count();
    const losses = await page.locator('a:has-text("Lost Match")').count();

    console.log(`  Page ${currentPage}: ${wins} wins, ${losses} losses`);

    pageResults.push({ page: currentPage, wins, losses });
    totalWins += wins;
    totalLosses += losses;

    // Check if there's a next page
    const nextLink = page.locator('a:has-text("Next ›")');
    hasNextPage = (await nextLink.count()) > 0;

    if (hasNextPage) {
      currentPage++;
      // Small delay to be respectful to the server
      await page.waitForTimeout(500);
    }
  }

  await browser.close();

  console.log("=".repeat(50));
  console.log(`TOTAL RESULTS for ${HERO.toUpperCase()}:`);
  console.log(`  Total Wins:   ${totalWins}`);
  console.log(`  Total Losses: ${totalLosses}`);
  console.log(`  Total Matches: ${totalWins + totalLosses}`);
  console.log(
    `  Win Rate:     ${((totalWins / (totalWins + totalLosses)) * 100).toFixed(2)}%`
  );

  return {
    pageResults,
    totalWins,
    totalLosses,
    totalMatches: totalWins + totalLosses,
    winRate: ((totalWins / (totalWins + totalLosses)) * 100).toFixed(2) + "%",
  };
}

scrapeMatches().catch(console.error);
