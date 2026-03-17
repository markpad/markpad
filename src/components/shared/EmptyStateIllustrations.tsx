/**
 * Lightweight inline SVG illustrations for empty states.
 * Each illustration is ~200×160 and uses currentColor-aware palette.
 */

const cls = {
  /** light surface */
  bg: 'fill-gray-200 dark:fill-gray-700',
  /** mid stroke / accents */
  line: 'stroke-gray-300 dark:stroke-gray-600',
  /** faint elements */
  faint: 'fill-gray-300 dark:fill-gray-600',
  /** primary blue accent */
  accent: 'fill-blue-400 dark:fill-blue-500',
  /** purple accent */
  purple: 'fill-purple-400 dark:fill-purple-500',
  /** fuchsia accent */
  fuchsia: 'fill-fuchsia-400 dark:fill-fuchsia-500',
  /** yellow accent */
  yellow: 'fill-amber-400 dark:fill-amber-500',
  /** soft shadow */
  shadow: 'fill-gray-300/40 dark:fill-gray-700/40',
}

export function DocumentsIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="60" ry="6" className={cls.shadow} />
      {/* Back page */}
      <rect x="52" y="22" width="96" height="120" rx="6" className={cls.bg} />
      {/* Middle page */}
      <rect
        x="58"
        y="16"
        width="96"
        height="120"
        rx="6"
        className="fill-gray-100 dark:fill-gray-800"
      />
      <rect
        x="58"
        y="16"
        width="96"
        height="120"
        rx="6"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Front page */}
      <rect
        x="64"
        y="10"
        width="96"
        height="120"
        rx="6"
        className="fill-white dark:fill-gray-750"
      />
      <rect
        x="64"
        y="10"
        width="96"
        height="120"
        rx="6"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Text lines */}
      <rect x="78" y="32" width="52" height="4" rx="2" className={cls.faint} />
      <rect x="78" y="44" width="68" height="3" rx="1.5" className={cls.faint} opacity="0.6" />
      <rect x="78" y="53" width="58" height="3" rx="1.5" className={cls.faint} opacity="0.6" />
      <rect x="78" y="62" width="63" height="3" rx="1.5" className={cls.faint} opacity="0.6" />
      <rect x="78" y="76" width="48" height="4" rx="2" className={cls.faint} />
      <rect x="78" y="88" width="68" height="3" rx="1.5" className={cls.faint} opacity="0.6" />
      <rect x="78" y="97" width="55" height="3" rx="1.5" className={cls.faint} opacity="0.6" />
      {/* Blue corner fold */}
      <path d="M140 10 L160 10 L160 30 Z" className={cls.accent} opacity="0.3" />
      {/* Plus badge */}
      <circle cx="148" cy="112" r="14" className={cls.accent} />
      <rect x="145" y="105" width="6" height="14" rx="1.5" className="fill-white" />
      <rect x="142" y="108" width="12" height="6" rx="1.5" className="fill-white" />
    </svg>
  )
}

export function SearchIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="50" ry="6" className={cls.shadow} />
      {/* Magnifying glass */}
      <circle cx="90" cy="72" r="36" className={cls.line} strokeWidth="3" />
      <circle cx="90" cy="72" r="28" className={cls.bg} />
      {/* Handle */}
      <line
        x1="118"
        y1="100"
        x2="144"
        y2="126"
        className={cls.line}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Sad face in lens */}
      <circle cx="80" cy="66" r="2.5" className={cls.faint} />
      <circle cx="100" cy="66" r="2.5" className={cls.faint} />
      <path
        d="M80 82 Q90 76 100 82"
        className={cls.line}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Question marks */}
      <text
        x="140"
        y="50"
        className="fill-gray-300 dark:fill-gray-600"
        fontSize="20"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        ?
      </text>
      <text
        x="154"
        y="36"
        className="fill-gray-300 dark:fill-gray-600"
        fontSize="14"
        fontFamily="sans-serif"
        fontWeight="bold"
        opacity="0.6"
      >
        ?
      </text>
    </svg>
  )
}

export function TrashIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="40" ry="5" className={cls.shadow} />
      {/* Bin body */}
      <path
        d="M70 50 L75 138 Q76 142 80 142 L120 142 Q124 142 125 138 L130 50"
        className={cls.bg}
      />
      <path
        d="M70 50 L75 138 Q76 142 80 142 L120 142 Q124 142 125 138 L130 50"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Lid */}
      <rect x="62" y="42" width="76" height="8" rx="3" className={cls.faint} />
      {/* Handle */}
      <rect
        x="90"
        y="36"
        width="20"
        height="8"
        rx="3"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Lines */}
      <line x1="87" y1="64" x2="85" y2="126" className={cls.line} strokeWidth="1.5" />
      <line x1="100" y1="64" x2="100" y2="126" className={cls.line} strokeWidth="1.5" />
      <line x1="113" y1="64" x2="115" y2="126" className={cls.line} strokeWidth="1.5" />
      {/* Sparkle = clean */}
      <path
        d="M140 30 L143 36 L149 39 L143 42 L140 48 L137 42 L131 39 L137 36 Z"
        className={cls.accent}
        opacity="0.5"
      />
      <path
        d="M60 26 L62 30 L66 32 L62 34 L60 38 L58 34 L54 32 L58 30 Z"
        className={cls.accent}
        opacity="0.35"
      />
    </svg>
  )
}

export function StarIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="50" ry="6" className={cls.shadow} />
      {/* Big star outline */}
      <path
        d="M100 20 L115 60 L158 65 L126 93 L134 136 L100 116 L66 136 L74 93 L42 65 L85 60 Z"
        className={cls.bg}
      />
      <path
        d="M100 20 L115 60 L158 65 L126 93 L134 136 L100 116 L66 136 L74 93 L42 65 L85 60 Z"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner dashed star suggestion */}
      <path
        d="M100 42 L108 66 L134 69 L115 86 L120 112 L100 100 L80 112 L85 86 L66 69 L92 66 Z"
        className={cls.line}
        strokeWidth="1"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.5"
      />
      {/* Small stars */}
      <path
        d="M160 40 L163 48 L171 51 L163 54 L160 62 L157 54 L149 51 L157 48 Z"
        className={cls.yellow}
        opacity="0.6"
      />
      <path
        d="M40 36 L42 41 L47 43 L42 45 L40 50 L38 45 L33 43 L38 41 Z"
        className={cls.yellow}
        opacity="0.4"
      />
    </svg>
  )
}

export function TemplatesIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="60" ry="6" className={cls.shadow} />
      {/* Stack of cards */}
      <rect x="46" y="30" width="108" height="80" rx="6" className={cls.bg} />
      <rect
        x="52"
        y="24"
        width="108"
        height="80"
        rx="6"
        className="fill-gray-100 dark:fill-gray-800"
      />
      <rect
        x="52"
        y="24"
        width="108"
        height="80"
        rx="6"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="58"
        y="18"
        width="108"
        height="80"
        rx="6"
        className="fill-white dark:fill-gray-750"
      />
      <rect
        x="58"
        y="18"
        width="108"
        height="80"
        rx="6"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Template layout blocks */}
      <rect x="70" y="30" width="28" height="4" rx="2" className={cls.purple} opacity="0.6" />
      <rect x="70" y="40" width="84" height="3" rx="1.5" className={cls.faint} opacity="0.5" />
      <rect x="70" y="48" width="78" height="3" rx="1.5" className={cls.faint} opacity="0.5" />
      <rect x="70" y="60" width="36" height="26" rx="3" className={cls.bg} />
      <rect x="112" y="60" width="42" height="26" rx="3" className={cls.bg} />
      {/* Copy badge */}
      <circle cx="152" cy="84" r="14" className={cls.purple} />
      <rect x="145" y="77" width="10" height="14" rx="1.5" className="fill-white" opacity="0.9" />
      <rect x="148" y="80" width="10" height="14" rx="1.5" className="fill-white" />
    </svg>
  )
}

export function ThemesIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="55" ry="6" className={cls.shadow} />
      {/* Palette shape */}
      <ellipse cx="100" cy="78" rx="65" ry="52" className={cls.bg} />
      <ellipse
        cx="100"
        cy="78"
        rx="65"
        ry="52"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Thumb hole */}
      <ellipse cx="120" cy="100" rx="12" ry="10" className="fill-gray-100 dark:fill-gray-900" />
      <ellipse
        cx="120"
        cy="100"
        rx="12"
        ry="10"
        className={cls.line}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Color dots */}
      <circle cx="68" cy="60" r="8" className="fill-rose-400 dark:fill-rose-500" />
      <circle cx="90" cy="48" r="8" className={cls.yellow} />
      <circle cx="115" cy="48" r="8" className="fill-emerald-400 dark:fill-emerald-500" />
      <circle cx="135" cy="60" r="8" className={cls.accent} />
      <circle cx="140" cy="82" r="8" className={cls.fuchsia} />
      {/* Brush */}
      <rect
        x="144"
        y="18"
        width="8"
        height="28"
        rx="2"
        className={cls.faint}
        transform="rotate(15 148 32)"
      />
      <rect
        x="143"
        y="44"
        width="10"
        height="16"
        rx="3"
        className={cls.fuchsia}
        opacity="0.7"
        transform="rotate(15 148 52)"
      />
      {/* Sparkle */}
      <path
        d="M48 36 L50 42 L56 44 L50 46 L48 52 L46 46 L40 44 L46 42 Z"
        className={cls.fuchsia}
        opacity="0.4"
      />
    </svg>
  )
}

export function StarredThemesIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="148" rx="50" ry="6" className={cls.shadow} />
      {/* Palette mini */}
      <ellipse cx="94" cy="84" rx="48" ry="38" className={cls.bg} />
      <ellipse cx="94" cy="84" rx="48" ry="38" className={cls.line} strokeWidth="1.5" fill="none" />
      {/* Color dots */}
      <circle cx="72" cy="72" r="6" className="fill-rose-400 dark:fill-rose-500" />
      <circle cx="90" cy="64" r="6" className={cls.yellow} />
      <circle cx="110" cy="68" r="6" className="fill-emerald-400 dark:fill-emerald-500" />
      {/* Heart */}
      <path
        d="M136 36 C130 24 114 24 114 38 C114 54 136 64 136 64 C136 64 158 54 158 38 C158 24 142 24 136 36 Z"
        className={cls.fuchsia}
        opacity="0.25"
      />
      <path
        d="M136 36 C130 24 114 24 114 38 C114 54 136 64 136 64 C136 64 158 54 158 38 C158 24 142 24 136 36 Z"
        className="stroke-fuchsia-400 dark:stroke-fuchsia-500"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
