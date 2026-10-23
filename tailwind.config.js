/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(--qf-${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./popup/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "error": c("error"),
        "on-background": c("on-background"),
        "surface-tint": c("surface-tint"),
        "outline-variant": c("outline-variant"),
        "on-tertiary-fixed-variant": c("on-tertiary-fixed-variant"),
        "primary-fixed": c("primary-fixed"),
        "error-container": c("error-container"),
        "on-tertiary-fixed": c("on-tertiary-fixed"),
        "tertiary": c("tertiary"),
        "outline": c("outline"),
        "inverse-primary": c("inverse-primary"),
        "secondary-container": c("secondary-container"),
        "background": c("background"),
        "surface-container-low": c("surface-container-low"),
        "surface-bright": c("surface-bright"),
        "surface-container-highest": c("surface-container-highest"),
        "primary-fixed-dim": c("primary-fixed-dim"),
        "primary-container": c("primary-container"),
        "on-secondary-fixed-variant": c("on-secondary-fixed-variant"),
        "on-secondary": c("on-secondary"),
        "on-surface-variant": c("on-surface-variant"),
        "surface-dim": c("surface-dim"),
        "secondary": c("secondary"),
        "on-tertiary-container": c("on-tertiary-container"),
        "surface-container": c("surface-container"),
        "on-primary-fixed-variant": c("on-primary-fixed-variant"),
        "on-primary-container": c("on-primary-container"),
        "tertiary-container": c("tertiary-container"),
        "tertiary-fixed-dim": c("tertiary-fixed-dim"),
        "on-surface": c("on-surface"),
        "on-primary-fixed": c("on-primary-fixed"),
        "on-secondary-fixed": c("on-secondary-fixed"),
        "primary": c("primary"),
        "surface-container-high": c("surface-container-high"),
        "on-error": c("on-error"),
        "secondary-fixed-dim": c("secondary-fixed-dim"),
        "surface": c("surface"),
        "surface-container-lowest": c("surface-container-lowest"),
        "surface-variant": c("surface-variant"),
        "tertiary-fixed": c("tertiary-fixed"),
        "on-error-container": c("on-error-container"),
        "on-primary": c("on-primary"),
        "on-tertiary": c("on-tertiary"),
        "inverse-on-surface": c("inverse-on-surface"),
        "secondary-fixed": c("secondary-fixed"),
        "on-secondary-container": c("on-secondary-container"),
        "inverse-surface": c("inverse-surface"),
        "electric-blue": c("electric-blue")
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "unit": "4px",
        "popup-max-height": "600px",
        "sm": "8px",
        "md": "12px",
        "xl": "24px",
        "gutter": "12px",
        "lg": "16px",
        "popup-width": "360px",
        "xs": "4px"
      },
      fontFamily: {
        "display-md": ["Inter"],
        "body-small": ["Inter"],
        "headline-sm": ["Inter"],
        "label-caps": ["Inter"],
        "body-base": ["Inter"],
        "body-mono": ["Courier Prime"]
      },
      fontSize: {
        "display-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-small": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "headline-sm": ["16px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "label-caps": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-base": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-mono": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "400" }]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
}
