const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

// Read site settings
const siteSettings = require("../contents/site-settings.json")

const OUTPUT_DIR = path.join(__dirname, "../public/meta")
const SITE_NAME = siteSettings.site_name || siteSettings.site_title || "Site"

// Icon sizes to generate
const ICON_SIZES = [
  { name: "favicon.ico", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "logo-512.png", size: 512 },
  { name: "maskable_icon_x192.png", size: 192 },
  { name: "maskable_icon_x512.png", size: 512 },
]

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Function to generate text-based icon using SVG
const { generateLogoSvg } = require("../src/utils/logoSvg")

async function generateIcon(text, size, outputPath) {
  const svg = generateLogoSvg({
    logoText: text,
    size,
    palette: siteSettings.logo_colors,
    bgColor: siteSettings.logo_bg_color || "#FFFFFF",
  })

  // Convert SVG to PNG using sharp
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outputPath)
}

// Main execution
async function generateAllIcons() {
  console.log("🎨 Generating icons for:", SITE_NAME)
  console.log("📁 Output directory:", OUTPUT_DIR)

  try {
    for (const icon of ICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, icon.name)
      console.log(`⏳ Generating ${icon.name} (${icon.size}x${icon.size})...`)
      await generateIcon(SITE_NAME, icon.size, outputPath)
      console.log(`✅ Created ${icon.name}`)
    }

    console.log("\n🎉 All icons generated successfully!")
    console.log(
      "\n💡 Tip: Icons are based on site_name from site-settings.json"
    )
  } catch (error) {
    console.error("❌ Error generating icons:", error)
    process.exit(1)
  }
}

// Run the script
generateAllIcons()
