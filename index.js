const playwright = require('playwright')

export const handler = async (event) => {
    const browser = await playwright.chromium.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://whsmithcareers.co.uk')
    await page.click('.job-link')
    await page.waitForSelector('[name=keyword]', { visible: true })
    await page.fill('[name=keyword]', 'Manchester Airport')
    await page.click('[type=submit]')
    await page.waitForSelector('.tr.jobs.hidden-xs', { visible: true })
    await page.waitForSelector("a[href^='https://krb-sjobs.brassring.com']", { visible: true })

    const data = await page.evaluate(() => {
        const jobs = document.querySelectorAll('.tr.jobs.hidden-xs')
        const jobsText = Array.from(jobs).map(job => job.innerText)
        const jobsHrefs = document.querySelectorAll("a[href^='https://krb-sjobs.brassring.com']")
        const jobLinks = Array.from(jobsHrefs).map(job => job.href)
        const uniqueJobLinks = [...new Set(jobLinks)]
        return { uniqueJobLinks, jobsText }
    })

    await browser.close()

    return { statusCode: 200, body: data }
}