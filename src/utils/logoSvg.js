/**
 * Shared logo SVG generator.
 * Used by generate-icons.js script and any other place needing a standalone SVG.
 *
 * This implementation mirrors the logic in src/components/sections/Logo.js:
 *   - Split words, top line holds first two words, rest go bottom.
 *   - Each word gets a color from a palette (configurable).
 *   - Lines are vertically stacked with a small negative gap.
 *   - Defaults use the Chakra theme's brand colors.
 */

function generateLogoSvg({
  size = 100,
  bgColor = "#FDFBF7",
  palette = [],
  logoText = "Site Logo",
  includeBg = true,
} = {}) {
  // default palette matches theme.colors.brand values
  const defaultPalette = [
    "#8B4513", // brand.primary
    "#2F4F4F", // brand.secondary
    "#DAA520", // brand.accent
    "#1F2937", // brand.ink
    "#6B7280", // brand.gray
  ]
  const colors = palette && palette.length ? palette : defaultPalette

  const getColor = index => colors[index % colors.length]

  const words = logoText.split(" ").filter(Boolean)
  const topWords = words.length <= 2 ? words : words.slice(0, 2)
  const bottomWords = words.length <= 2 ? [] : words.slice(2)

  // calculate font sizes/spacing
  const topFontSize = Math.floor(size * 0.25)
  const bottomFontSize = Math.floor(size * 0.3)
  const spacing = Math.round(size * 0.03) // negative gap between lines

  const totalHeight = topFontSize + bottomFontSize - spacing
  const startY = (size - totalHeight) / 2

  const topBaseline = startY + topFontSize * 0.82
  const bottomBaseline = startY + topFontSize + bottomFontSize * 0.82 - spacing

  function renderLine(wordsArray, y, isBottom) {
    const fontSize = isBottom ? bottomFontSize : topFontSize
    const fontWeight = isBottom ? "900" : "500"
    const fontStyle = isBottom ? "" : 'font-style="italic"'
    const tspan = wordsArray
      .map((w, idx) => {
        const space = idx !== wordsArray.length - 1 ? " " : ""
        return `<tspan fill="${getColor(idx)}">${w}${space}</tspan>`
      })
      .join("")
    return `
      <text
        x="${size / 2}"
        y="${y}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}"
        font-weight="${fontWeight}"
        ${fontStyle}
        text-anchor="middle"
      >${tspan}</text>`
  }

  const background = includeBg
    ? `<rect width="${size}" height="${size}" fill="${bgColor}"/>`
    : ""

  const topSvg = renderLine(topWords, topBaseline, false)
  const bottomSvg =
    bottomWords.length > 0 ? renderLine(bottomWords, bottomBaseline, true) : ""

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${background}
  ${topSvg}
  ${bottomSvg}
</svg>`
}

// Export for both CommonJS (Node.js scripts) and ES modules (React components)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { generateLogoSvg }
}

export { generateLogoSvg }
