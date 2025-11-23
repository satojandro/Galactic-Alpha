import { VaultCard } from "./vault-card"

// Try to import vault config if it exists (optional)
let vaultAddresses: Record<string, `0x${string}`> = {}
try {
  // Dynamic import to handle missing file gracefully
  const configModule = require("@/lib/vault-config")
  vaultAddresses = configModule.VAULT_CONFIG || {}
} catch (error) {
  // Config file doesn't exist yet - that's okay, vaults will work without addresses
  // This is expected and not an error
}

const vaults = [
  {
    id: "mercury-retrograde",
    name: "Mercury Retrograde Short ETH",
    symbol: "☿",
    apy: "42.0",
    tvl: "$2.8M",
    condition: "Active Only During Retrograde",
    color: "silver",
    description: "Profit from chaos. Short ETH when Mercury goes backward.",
    riskLevel: "Extreme",
  },
  {
    id: "full-moon-growth",
    name: "Full Moon Growth Fund",
    symbol: "☽",
    apy: "18.5",
    tvl: "$12.4M",
    condition: "Boosted APY at Full Moon",
    color: "blue",
    description: "Stable growth that peaks during lunar maximums.",
    riskLevel: "Low",
  },
  {
    id: "jupiter-luck",
    name: "Jupiter Luck Streak",
    symbol: "♃",
    apy: "88.8",
    tvl: "$7.2M",
    condition: "Enhanced When Jupiter in Transit",
    color: "gold",
    description: "Expansive yields blessed by the planet of abundance.",
    riskLevel: "High",
  },
  {
    id: "venus-stable",
    name: "Venus Harmony Stablecoin",
    symbol: "♀",
    apy: "6.9",
    tvl: "$45.1M",
    condition: "Always Active, Aesthetic Vibes",
    color: "rose",
    description: "Love your yields. Stable returns with elegant balance.",
    riskLevel: "Very Low",
  },
  {
    id: "mars-aggressive",
    name: "Mars War Chest",
    symbol: "♂",
    apy: "156.0",
    tvl: "$3.5M",
    condition: "Active During Mars Direct",
    color: "red",
    description: "Aggressive leverage strategy. For warriors only.",
    riskLevel: "Degen",
  },
  {
    id: "saturn-discipline",
    name: "Saturn Long-Term Lock",
    symbol: "♄",
    apy: "24.7",
    tvl: "$18.9M",
    condition: "29-Year Lock Period",
    color: "slate",
    description: "Disciplined staking. Rewards patience with cosmic interest.",
    riskLevel: "Medium",
  },
]

export function VaultGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vaults.map((vault, index) => (
        <VaultCard
          key={vault.id}
          vault={{
            ...vault,
            address: vaultAddresses[vault.id], // Add contract address if configured
          }}
          index={index}
        />
      ))}
    </div>
  )
}
