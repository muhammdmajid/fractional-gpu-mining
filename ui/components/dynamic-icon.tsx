import { icons, AlertCircle } from "lucide-react"
import type { LucideProps } from "lucide-react"
import type { DynamicIconNameType } from "@/types"

interface DynamicIconProps extends LucideProps {
  name: DynamicIconNameType
  /** Optional fallback icon name (defaults to built-in AlertCircle) */
  fallbackIcon?: DynamicIconNameType
}

export function DynamicIcon({
  name,
  fallbackIcon,
  ...props
}: DynamicIconProps) {

  try {
    // Resolve the main icon
    const Icon = icons[name]

    if (Icon) {
      return <Icon {...props} />
    }

    // If missing, try fallback icon
    if (fallbackIcon) {
      const Fallback = icons[fallbackIcon]
      if (Fallback) {
        console.warn(`⚠️ Invalid icon "${name}". Falling back to "${fallbackIcon}".`)
        return <Fallback {...props} />
      }
    }

    // Final fallback → built-in AlertCircle
    console.warn(`⚠️ Invalid icon "${name}". Falling back to "AlertCircle".`)
    return <AlertCircle {...props} />
  } catch (error) {
    console.error("❌ Error rendering DynamicIcon:", error)
    return <AlertCircle {...props} />
  }
}
