export const AVAILABLE_SKILLS = [
  'React',
  'TypeScript',
  'AI / LLM',
  'Solana',
  'Python',
  'Tailwind',
  'Rust',
  'FastAPI',
  'Next.js',
  'UI/UX',
  'Node.js',
  'Smart Contracts',
]

/**
 * Checks if a quick skill badge is present in a comma-separated stack string.
 */
export function isSkillInStack(badge: string, stackStr: string): boolean {
  if (!stackStr) return false
  const items = stackStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const bLower = badge.toLowerCase()

  return items.some((item) => {
    if (item === bLower) return true
    // Special alias handling for AI / LLM
    if (bLower === 'ai / llm' && (item === 'ai' || item === 'llm' || item === 'ai/llm' || item === 'ai / llm')) {
      return true
    }
    // Special alias handling for Node.js
    if (bLower === 'node.js' && (item === 'node' || item === 'node.js' || item === 'nodejs')) {
      return true
    }
    // Special alias handling for Next.js
    if (bLower === 'next.js' && (item === 'next' || item === 'next.js' || item === 'nextjs')) {
      return true
    }
    // Special alias handling for UI/UX
    if (bLower === 'ui/ux' && (item === 'ui/ux' || item === 'ui' || item === 'ux' || item === 'design')) {
      return true
    }
    return false
  })
}

/**
 * Adds or removes a badge from a comma-separated stack string.
 */
export function toggleSkillInStack(badge: string, stackStr: string): string {
  if (isSkillInStack(badge, stackStr)) {
    const items = stackStr.split(',').map((s) => s.trim()).filter(Boolean)
    const filtered = items.filter((item) => {
      const iLower = item.toLowerCase()
      const bLower = badge.toLowerCase()
      if (iLower === bLower) return false
      if (bLower === 'ai / llm' && (iLower === 'ai' || iLower === 'llm' || iLower === 'ai/llm' || iLower === 'ai / llm')) {
        return false
      }
      if (bLower === 'node.js' && (iLower === 'node' || iLower === 'node.js' || iLower === 'nodejs')) {
        return false
      }
      if (bLower === 'next.js' && (iLower === 'next' || iLower === 'next.js' || iLower === 'nextjs')) {
        return false
      }
      if (bLower === 'ui/ux' && (iLower === 'ui/ux' || iLower === 'ui' || iLower === 'ux')) {
        return false
      }
      return true
    })
    return filtered.join(', ')
  } else {
    const trimmed = stackStr.trim()
    if (!trimmed) return badge
    return `${trimmed}, ${badge}`
  }
}

/**
 * Returns all skills from available list that are present in the stack string.
 */
export function getMatchedSkillsFromStack(availableSkills: string[], stackStr: string): string[] {
  return availableSkills.filter((badge) => isSkillInStack(badge, stackStr))
}

/**
 * Parses comma-separated stack string into clean skill array.
 */
export function parseSkillsFromStack(stackStr: string): string[] {
  if (!stackStr) return []
  return stackStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
