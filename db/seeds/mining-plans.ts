/* eslint-disable @typescript-eslint/no-explicit-any */
// 📦 Imports
import { eq } from "drizzle-orm";
import { db } from "..";
import {
  miningPlanGpusTable,
  miningPlanOptionGpusTable,
  miningPlanOptionsTable,
  miningPlansTable,
  PLAN_OPTION_TYPES,
} from "../schema";

// ============================
// 🌟 Seed Mining Plans, GPUs, Options, and Relations
// ============================
export async function seedMiningPlans() {
  // 🔹 Helper for upsert-like behavior
  async function upsert<T extends { id: string }>(
    table: any,
    queryTable: any,
    rows: T[],
  ) {
    for (const row of rows) {
      const existing = await queryTable.findFirst({
        where: (t: any, { eq }: any) => eq(t.id, row.id),
      });

      if (existing) {
        await db.update(table).set(row).where(eq(table.id, row.id));
      } else {
        await db.insert(table).values(row);
      }
    }
  }

  // 1️⃣ Insert / Update Mining Plans
  await upsert(miningPlansTable, db.query.miningPlansTable, [
    {
      id: "a1f9c3d4e5b67890abcd1234ef567890",
      title: "mRig1",
      description:
        "Flagship high-performance mining facility offering fractional GPU mining.",
      features: [
        "Fractional GPU mining",
        "High performance GPUs",
        "Advanced thermal management",
        "24/7 continuous uptime",
      ],
      actionLabel: "Deposit Now",
      priority: 1,
      popular: true,
    },
    {
      id: "e5f1a7b8c9d01234ef567890abcd1234",
      title: "mRig2",
      description: "Enhanced computational power for miners and developers.",
      features: [
        "2nd Gen GPU performance",
        "AI & deep learning optimization",
        "Blockchain mining ready",
        "Advanced monitoring dashboard",
      ],
      actionLabel: "Deposit Now",
      priority: 2,
      popular: true,
    },
    {
      id: "c9d5e1f2a3b45678abcd1234ef567890",
      title: "mRig3",
      description:
        "Decentralized mining solution with latest generation GPU infrastructure.",
      features: [
        "Cutting-edge GPU infrastructure",
        "Decentralized mining",
        "Parallel processing",
        "Real-time dashboard",
        "Expert monitoring & support",
      ],
      actionLabel: "Deposit Now",
      priority: 3,
      popular: true,
    },
  ]);

  // 2️⃣ Insert / Update GPUs
  await upsert(miningPlanGpusTable, db.query.miningPlanGpusTable, [
    {
      id: "c3d9e5f6b7f80912cdef3456ab789012",
      model: "NVIDIA RTX 4090",
      memory: "24 GB",
      hashRate: "100",
      powerConsumption: "450 W",
      fraction: "1.00",
      pricePerGpu: "2.00",
    },
    {
      id: "a7b3c9d0e1f23456ab789012cdef3456",
      model: "NVIDIA RTX 5080",
      memory: "20 GB",
      hashRate: "200",
      powerConsumption: "350 W",
      fraction: "1.00",
      pricePerGpu: "4.00",
    },
    {
      id: "e1f7a3b4c5d67890cdef3456ab789012",
      model: "NVIDIA RTX 5090",
      memory: "24 GB",
      hashRate: "300",
      powerConsumption: "400 W",
      fraction: "1.00",
      pricePerGpu: "8.00",
    },
  ]);

  // 3️⃣ Insert / Update Mining Plan Options
  await upsert(miningPlanOptionsTable, db.query.miningPlanOptionsTable, [
    {
      id: "b2c8d4f5a6e79801bcde2345fa678901",
      planId: "a1f9c3d4e5b67890abcd1234ef567890",
      type: PLAN_OPTION_TYPES[0],
      basePrice: "0.00",
      miningCycle: 20,
      baseDiscount: 0,
      features: ["Best for short-term mining", "Flexible withdrawal"],
      totalPrice: "0.00",
    },
    {
      id: "b2c8d4f5a6e79801bcde2345fa6789ff",
      planId: "a1f9c3d4e5b67890abcd1234ef567890",
      type: PLAN_OPTION_TYPES[1],
      basePrice: "0.00",
      miningCycle: 60,
      baseDiscount: 10,
      features: ["Discounted yearly savings", "Priority GPU upgrades"],
      totalPrice: "0.00",
    },
    {
      id: "f6a2b8c9d0e12345fa678901bcde2345",
      planId: "e5f1a7b8c9d01234ef567890abcd1234",
      type: PLAN_OPTION_TYPES[0],
      basePrice: "0.00",
      miningCycle: 22,
      baseDiscount: 0,
      features: ["Balanced monthly plan", "AI optimization enabled"],
      totalPrice: "0.00",
    },
    {
      id: "f6a2b8c9d0e12345fa678901bcde23ff",
      planId: "e5f1a7b8c9d01234ef567890abcd1234",
      type: PLAN_OPTION_TYPES[1],
      basePrice: "0.00",
      miningCycle: 64,
      baseDiscount: 10,
      features: ["Save more with yearly subscription", "Priority support"],
      totalPrice: "0.00",
    },
    {
      id: "d0e6f2a3b4c56789bcde2345fa678901",
      planId: "c9d5e1f2a3b45678abcd1234ef567890",
      type: PLAN_OPTION_TYPES[0],
      basePrice: "0.00",
      miningCycle: 24,
      baseDiscount: 0,
      features: ["Powerful monthly GPU mining", "Decentralized operation"],
      totalPrice: "0.00",
    },
    {
      id: "d0e6f2a3b4c56789bcde2345fa6789ff",
      planId: "c9d5e1f2a3b45678abcd1234ef567890",
      type: PLAN_OPTION_TYPES[1],
      basePrice: "0.00",
      miningCycle: 72,
      baseDiscount: 10,
      features: ["Yearly mining at lower cost", "Expert monitoring & support"],
      totalPrice: "0.00",
    },
  ]);

  // 4️⃣ Insert / Update Option-GPU Relations
  await upsert(miningPlanOptionGpusTable, db.query.miningPlanOptionGpusTable, [
    { id: "d4e0f6a7c8a91023def4567abc890123", optionId: "b2c8d4f5a6e79801bcde2345fa678901", gpuId: "c3d9e5f6b7f80912cdef3456ab789012" },
    { id: "d4e0f6a7c8a91023def4567abc89fff", optionId: "b2c8d4f5a6e79801bcde2345fa6789ff", gpuId: "c3d9e5f6b7f80912cdef3456ab789012" },
    { id: "b8c4d0e1f2b34567bc890123def4567a", optionId: "f6a2b8c9d0e12345fa678901bcde2345", gpuId: "a7b3c9d0e1f23456ab789012cdef3456" },
    { id: "b8c4d0e1f2b34567bc890123def45fff", optionId: "f6a2b8c9d0e12345fa678901bcde23ff", gpuId: "a7b3c9d0e1f23456ab789012cdef3456" },
    { id: "f2a8b4c5d6e78901def4567abc890123", optionId: "d0e6f2a3b4c56789bcde2345fa678901", gpuId: "e1f7a3b4c5d67890cdef3456ab789012" },
    { id: "f2a8b4c5d6e78901def4567abc89fff", optionId: "d0e6f2a3b4c56789bcde2345fa6789ff", gpuId: "e1f7a3b4c5d67890cdef3456ab789012" },
  ]);

  // 5️⃣ Calculate & Update Prices
  const optionGpusPrices = await db
    .select({
      optionId: miningPlanOptionGpusTable.optionId,
      pricePerGpu: miningPlanGpusTable.pricePerGpu,
    })
    .from(miningPlanOptionGpusTable)
    .leftJoin(
      miningPlanGpusTable,
      eq(miningPlanGpusTable.id, miningPlanOptionGpusTable.gpuId),
    );

  const totalPriceMap: Record<string, number> = {};
  optionGpusPrices.forEach(({ optionId, pricePerGpu }) => {
    const price = parseFloat(pricePerGpu ?? "0.00");
    totalPriceMap[optionId] = (totalPriceMap[optionId] ?? 0) + price;
  });

  for (const [optionId, monthlyTotal] of Object.entries(totalPriceMap)) {
    const option = await db.query.miningPlanOptionsTable.findFirst({
      where: (opt, { eq }) => eq(opt.id, optionId),
    });
    if (!option) continue;

    let totalPrice = monthlyTotal;
    if (option.type === "yearly") {
      totalPrice = monthlyTotal * 12 * (1 - (option.baseDiscount ?? 0) / 100);
    }

    await db
      .update(miningPlanOptionsTable)
      .set({ totalPrice: totalPrice.toFixed(2) })
      .where(eq(miningPlanOptionsTable.id, optionId));
  }

  console.log("✅ Mining plans, GPUs, options & relations seeded (with upserts).");
}
