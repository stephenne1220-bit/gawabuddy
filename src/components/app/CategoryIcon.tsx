import {
  ArrowLeftRight,
  Briefcase,
  Bus,
  Film,
  Landmark,
  PiggyBank,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Store,
  Tag,
  Utensils,
  Wallet,
  Zap,
  Home,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  'shopping-basket': ShoppingBasket,
  bus: Bus,
  smartphone: Smartphone,
  zap: Zap,
  film: Film,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  'piggy-bank': PiggyBank,
  landmark: Landmark,
  briefcase: Briefcase,
  store: Store,
  wallet: Wallet,
  transfer: ArrowLeftRight,
}

export function CategoryIcon({
  icon,
  color = '#0B3D2E',
  size = 18,
}: {
  icon?: string | null
  color?: string | null
  size?: number
}) {
  const Icon = (icon && ICONS[icon]) || Tag
  const c = color || '#0B3D2E'
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ background: `${c}22`, color: c }}
    >
      <Icon size={size} />
    </span>
  )
}