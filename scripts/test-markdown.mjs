import markdownToHtml from "../src/libs/markdownToHTML.js"

const md = `## 🥇 Top Dog Foods for Sensitive Stomachs

Here is a comparative table of some top-rated dog foods for sensitive stomachs:

| Brand               | Main Ingredients              | Special Features               |
|---------------------|-------------------------------|--------------------------------|
| Hill's Science Diet | Chicken, Barley               | Prebiotic fiber, vitamin E     |
| Purina Pro Plan     | Salmon, Rice                  | Live probiotics, omega-6 fatty acids |
| Royal Canin         | Hydrolyzed Protein, Oatmeal   | Hydrolyzed protein, high digestibility  |
| Blue Buffalo        | Turkey, Potato                | Grain-free, limited ingredients |
`

;(async () => {
  try {
    const out = await markdownToHtml(md)
    console.log(out)
  } catch (err) {
    console.error("Error rendering markdown:", err)
    process.exit(1)
  }
})()
