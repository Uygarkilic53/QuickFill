/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./popup/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "error": "#ffb4ab",
        "on-background": "#dae2fd",
        "surface-tint": "#adc6ff",
        "outline-variant": "#424754",
        "on-tertiary-fixed-variant": "#653e00",
        "primary-fixed": "#d8e2ff",
        "error-container": "#93000a",
        "on-tertiary-fixed": "#2a1700",
        "tertiary": "#ffb95f",
        "outline": "#8c909f",
        "inverse-primary": "#005ac2",
        "secondary-container": "#00a572",
        "background": "#0b1326",
        "surface-container-low": "#131b2e",
        "surface-bright": "#31394d",
        "surface-container-highest": "#2d3449",
        "primary-fixed-dim": "#adc6ff",
        "primary-container": "#4d8eff",
        "on-secondary-fixed-variant": "#005236",
        "on-secondary": "#003824",
        "on-surface-variant": "#c2c6d6",
        "surface-dim": "#0b1326",
        "secondary": "#4edea3",
        "on-tertiary-container": "#3e2400",
        "surface-container": "#171f33",
        "on-primary-fixed-variant": "#004395",
        "on-primary-container": "#00285d",
        "tertiary-container": "#ca8100",
        "tertiary-fixed-dim": "#ffb95f",
        "on-surface": "#dae2fd",
        "on-primary-fixed": "#001a42",
        "on-secondary-fixed": "#002113",
        "primary": "#adc6ff",
        "surface-container-high": "#222a3d",
        "on-error": "#690005",
        "secondary-fixed-dim": "#4edea3",
        "surface": "#0b1326",
        "surface-container-lowest": "#060e20",
        "surface-variant": "#2d3449",
        "tertiary-fixed": "#ffddb8",
        "on-error-container": "#ffdad6",
        "on-primary": "#002e6a",
        "on-tertiary": "#472a00",
        "inverse-on-surface": "#283044",
        "secondary-fixed": "#6ffbbe",
        "on-secondary-container": "#00311f",
        "inverse-surface": "#dae2fd",
        "electric-blue": "#3B82F6"
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
