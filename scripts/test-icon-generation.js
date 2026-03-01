// Optional: This test requires 'canvas' package for local testing
// Install it with: npm install --save-dev canvas
let createCanvas
try {
  createCanvas = require("canvas").createCanvas
} catch (err) {
  console.log("⚠️  Canvas package not installed. This test is optional.")
  console.log(
    "   To run this test, install canvas: npm install --save-dev canvas"
  )
  console.log(
    "   Note: Canvas requires native dependencies and is not needed for production builds.\n"
  )
  process.exit(0)
}

const fs = require("fs")
const path = require("path")

console.log("🧪 Testing canvas text rendering...\n")

// Test 1: Simple canvas with text
function testSimpleCanvas() {
  console.log("Test 1: Creating simple canvas with text")

  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext("2d")

  // White background
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, 200, 200)

  // Black text
  ctx.fillStyle = "#000000"
  ctx.font = "bold 40px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("TEST", 100, 100)

  const buffer = canvas.toBuffer("image/png")
  const testPath = path.join(__dirname, "../public/meta/test-simple.png")
  fs.writeFileSync(testPath, buffer)

  console.log("✅ Saved to:", testPath)
  console.log("📊 Buffer size:", buffer.length, "bytes")
}

// Test 2: Two-line text like Logo.js
function testTwoLineCanvas() {
  console.log("\nTest 2: Creating two-line canvas (Pretty Long style)")

  const canvas = createCanvas(512, 512)
  const ctx = canvas.getContext("2d")

  // White background
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, 512, 512)

  // Top line - italic
  ctx.fillStyle = "#000000"
  ctx.font = "italic 128px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "bottom"
  ctx.fillText("Pretty", 256, 246)

  // Bottom line - bold
  ctx.font = "bold 154px Arial"
  ctx.textBaseline = "top"
  ctx.fillText("Long", 256, 266)

  const buffer = canvas.toBuffer("image/png")
  const testPath = path.join(__dirname, "../public/meta/test-twolines.png")
  fs.writeFileSync(testPath, buffer)

  console.log("✅ Saved to:", testPath)
  console.log("📊 Buffer size:", buffer.length, "bytes")
}

// Test 3: Using actual site name via generateLogoSvg helper
async function testActualSiteName() {
  console.log("\nTest 3: Using actual site name from settings (SVG)")

  const siteSettings = require("../contents/site-settings.json")
  const siteName = siteSettings.site_name || "Pretty Long"

  console.log("📝 Site name:", siteName)

  const { generateLogoSvg } = require("../src/utils/logoSvg")
  const svg = generateLogoSvg({
    logoText: siteName,
    size: 512,
    palette: siteSettings.logo_colors,
    bgColor: "#FFFFFF",
  })

  const buffer = await sharp(Buffer.from(svg)).resize(512, 512).png().toBuffer()
  const testPath = path.join(__dirname, "../public/meta/test-actual.png")
  fs.writeFileSync(testPath, buffer)

  console.log("✅ Saved to:", testPath)
  console.log("📊 Buffer size:", buffer.length, "bytes")
}

// Run all tests
try {
  testSimpleCanvas()
  testTwoLineCanvas()
  await testActualSiteName()

  console.log("\n✅ All tests complete!")
  console.log("🔍 Check the test-*.png files in public/meta/")
  console.log("\nTo view:")
  console.log("  open public/meta/test-simple.png")
  console.log("  open public/meta/test-twolines.png")
  console.log("  open public/meta/test-actual.png")
} catch (error) {
  console.error("\n❌ Error:", error.message)
  console.error(error.stack)
}
