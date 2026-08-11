interface StackRule {
  match: RegExp
  title: string
}

const STACK_TITLES: StackRule[] = [
  { match: /react|next|vue|frontend|tailwind|css/i, title: 'Frontend Alchemist' },
  { match: /node|express|django|flask|fastapi|backend|api/i, title: 'Backend Architect' },
  { match: /ml|ai|tensorflow|pytorch|llm|groq|model/i, title: 'ML Whisperer' },
  { match: /solidity|web3|blockchain|smart contract/i, title: 'Chain Sorcerer' },
  { match: /devops|docker|kubernetes|aws|render|vercel/i, title: 'Infra Ranger' },
  { match: /mongo|sql|postgres|firebase|database/i, title: 'Data Custodian' },
  { match: /design|figma|ui|ux/i, title: 'Pixel Shaper' },
  { match: /full.?stack/i, title: 'Full-Stack Voyager' },
]

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function generateBuilderClass(stack: string): string {
  const trimmed = stack.trim()
  if (!trimmed) return 'Goa Wildcard Builder'

  for (const rule of STACK_TITLES) {
    if (rule.match.test(trimmed)) return rule.title
  }

  const words = trimmed.split(/[,+/&]/).map((s) => s.trim()).filter(Boolean)
  const first = words[0] || trimmed
  return `${cap(first)} Specialist`
}
