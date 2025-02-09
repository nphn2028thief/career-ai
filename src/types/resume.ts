import { z } from "zod";

import { entrySchema } from "@/lib/schema";

export type TEntry = z.infer<typeof entrySchema>;
