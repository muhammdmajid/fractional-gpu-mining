import { pgTableCreator } from "drizzle-orm/pg-core"
import { databasePrefix } from "@/lib/constants"
import CryptoJS from "crypto-js";

export const pgTable = pgTableCreator((name) => `${databasePrefix}_${name}`)


import { type AnyColumn, sql } from "drizzle-orm";



export function takeFirstOrNull<TData>(data: TData[]) {
  return data[0] ?? null;
}

export function takeFirstOrThrow<TData>(data: TData[], errorMessage?: string) {
  const first = takeFirstOrNull(data);

  if (!first) {
    throw new Error(errorMessage ?? "Item not found");
  }

  return first;
}

export function isEmpty<TColumn extends AnyColumn>(column: TColumn) {
  return sql<boolean>`
    case
      when ${column} is null then true
      when ${column} = '' then true
      when ${column}::text = '[]' then true
      when ${column}::text = '{}' then true
      else false
    end
  `;
}

export function generateUniqueId(
  prefix: string = "id",
  targetLength: number = 16
): string {
  try {
    if (!prefix || typeof prefix !== "string") {
      throw new Error("Prefix must be a non-empty string.");
    }

    if (!Number.isInteger(targetLength) || targetLength < prefix.length + 2) {
      throw new Error(
        `Invalid target length. Must be an integer ≥ prefix length + 2 (got ${targetLength}).`
      );
    }

    const baseLength = prefix.length + 1; // prefix + hyphen
    const remainingLength = targetLength - baseLength;

    // Each hex char = 4 bits, need ceil(remainingLength / 2) bytes
    const randomBytes = Math.ceil(remainingLength / 2);
    const randomHex = CryptoJS.lib.WordArray.random(randomBytes).toString(
      CryptoJS.enc.Hex
    );

    return `${prefix}-${randomHex.slice(0, remainingLength)}`;
  } catch (error) {
    console.error("[generateUniqueId Error]", error);

    // fallback: generate a UUID-like random string if input invalid
    const fallback = CryptoJS.lib.WordArray.random(8).toString(CryptoJS.enc.Hex);
    return `fallback-${fallback}`;
  }
}


/**
 * Generate a 10-digit random number as a string using CryptoJS with error handling
 */
export function generateRandom10DigitNumber(): string {
  try {
    // Generate 5 random bytes → 10 hex characters
    const randomBytes = CryptoJS.lib.WordArray.random(5);
    const hexString = randomBytes.toString(CryptoJS.enc.Hex);

    // Convert hex to decimal string
    let decimalNumber = BigInt(`0x${hexString}`).toString().slice(0, 10);

    // Ensure exactly 10 digits
    decimalNumber = decimalNumber.padStart(10, "0");

    return decimalNumber;
  } catch (error) {
    console.error("[generateRandom10DigitNumber Error]", error);

    // Fallback: generate using Math.random
    const fallback = Math.floor(1_000_000_000 + Math.random() * 9_000_000_000);
    return fallback.toString();
  }
}
