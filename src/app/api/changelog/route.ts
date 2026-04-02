import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "changelog.json");
    const data = readFileSync(filePath, "utf-8");
    const changelog = JSON.parse(data);
    return NextResponse.json(changelog);
  } catch {
    return NextResponse.json([]);
  }
}
