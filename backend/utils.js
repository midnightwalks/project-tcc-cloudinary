import fs from "node:fs";

export function getEnv() {
  const envFile = fs
    .readFileSync(".env")
    .toString()
    .replace(/\r/g, "")
    .split("\n")
    .map((val) => val.split("="));
  return Object.fromEntries(envFile);
}