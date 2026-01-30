import type { InferSelectModel } from "drizzle-orm";
import type { sessionTable, } from "./tables";


export type Session = InferSelectModel<typeof sessionTable>;

