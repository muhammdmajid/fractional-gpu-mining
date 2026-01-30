import { ServerResponse } from "@/types"

export async function fakeSendEmailAPI<TData = unknown>(data: {
  from: string
  subject: string
  content: string
}): Promise<ServerResponse<TData>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.from.includes("fail")) {
        resolve({
          success: false,
          error: "Simulated send failure",
        })
      } else {
        resolve({
          success: true,
          message: "Email sent successfully!",
          data: {} as TData, // default empty data
        })
      }
    }, 1500)
  })
}
