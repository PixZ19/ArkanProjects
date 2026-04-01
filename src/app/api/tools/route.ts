import { NextResponse } from "next/server";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

/**
 * GET /api/tools
 *
 * Scans /public/installer/ for *.sh files, extracts TOOL_NAME / TOOL_DESC /
 * TOOL_BADGE variables, and returns them as JSON.  The landing page calls this
 * endpoint so new installers appear automatically after a file drop.
 */
export async function GET() {
  const dir = join(process.cwd(), "public", "installer");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arkanprojects.vercel.app";

  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".sh")).sort();
  } catch {
    return NextResponse.json([]);
  }

  const tools = files.map((file) => {
    const slug = file.replace(/\.sh$/, "");
    let name = slug;
    let desc = "";
    let badge = "Stable";

    try {
      const content = readFileSync(join(dir, file), "utf-8");

      const matchName = content.match(/readonly\s+TOOL_NAME="([^"]*)"/);
      if (matchName) name = matchName[1];

      const matchDesc = content.match(/readonly\s+TOOL_DESC="([^"]*)"/);
      if (matchDesc) desc = matchDesc[1];

      const matchBadge = content.match(/readonly\s+TOOL_BADGE="([^"]*)"/);
      if (matchBadge) badge = matchBadge[1];
    } catch {
      // skip parse errors — use defaults
    }

    return {
      name: slug,
      title: name,
      desc,
      cmd: `bash <(curl -s ${baseUrl}/installer/${slug}.sh)`,
      badge,
    };
  });

  return NextResponse.json(tools);
}
