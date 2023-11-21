import * as fs from 'fs'
import * as core from '@actions/core'
import * as glob from '@actions/glob'

interface ImageResult {
  screenshots: Map<string, string>
}

export async function readImageJson(imageJsonPaths: string): Promise<ImageResult> {
  const globber = await glob.create(imageJsonPaths, {followSymbolicLinks: false})

  const screenshotsMap = new Map<string, string>()

  for await (const file of globber.globGenerator()) {
    const data: string = fs.readFileSync(file, 'utf8')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let report: any
    try {
      report = JSON.parse(data)
      for (const key in report) {
        if (report.hasOwnProperty(key)) {
          screenshotsMap.set(key, report[key])
        }
      }
    } catch (error) {
      core.error(`⚠️ Failed to parse file (${file}) with error ${error}`)
    }
  }
  return {
    screenshots: screenshotsMap
  }
}
