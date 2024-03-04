import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_SCANO_API: z.string().min(1),
    NEXT_PUBLIC_STRAPI_URL: z.string().min(1),
    NEXT_PUBLIC_TOKEN: z.string().min(1)
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SCANO_API: process.env.NEXT_PUBLIC_SCANO_API,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_TOKEN
  },
})
