import { extendTheme, theme as chakraTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  colors: {
    brand: {
      // Warm, bookish color palette
      primary: "#8B4513", // Saddle brown - leather book binding
      secondary: "#2F4F4F", // Dark slate - sophisticated ink
      accent: "#DAA520", // Goldenrod - bookplate gold
      cream: "#FDFBF7", // Off-white - aged paper
      parchment: "#F5F1E8", // Parchment - reading background
      ink: "#1F2937", // Dark ink for text
      gray: "#6B7280",
      lightGray: "#9CA3AF",
    },
  },
  breakpoints: {
    sm: "30em", // small phone
    md: "48em", // ipad
    lg: "62em", // ipad pro
    xl: "80em", // laptop
    xxl: "96em", // pc
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "sm",
      },
      variants: {
        primary: {
          bg: "brand.primary",
          color: "white",
          _hover: { bg: "#7A3D11", transform: "translateY(-1px)" },
        },
        outline: {
          borderColor: "brand.primary",
          color: "brand.primary",
          _hover: { bg: "brand.parchment" },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: "700",
        color: "brand.ink",
      },
    },
    Text: {
      baseStyle: {
        color: "gray.700",
        lineHeight: "1.7",
      },
    },
    Link: {
      baseStyle: {
        color: "brand.primary",
        _hover: { textDecoration: "underline", color: "brand.secondary" },
      },
    },
  },
  styles: {
    global: {
      "::selection": {
        color: "white",
        background: "#8B4513",
      },
      "::-webkit-scrollbar": {
        width: "0.5em",
      },
      "::-webkit-scrollbar-track": {
        background: "#F5F1E8",
      },
      "::-webkit-scrollbar-thumb": {
        transition: "150ms all ease-in-out",
        bgColor: "#D4C4A8",
        borderRadius: "full",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#B8A88A",
      },
      html: {
        scrollBehavour: "smooth",
      },
      "html, body": {
        overflowX: "hidden",
        backgroundColor: "#FDFBF7", // Cream background for reading comfort
        color: "#1F2937",
        fontSize: "16px",
        lineHeight: "1.7",
      },
      ".booxtore-logo": {
        fontFamily: "'Georgia', 'Times New Roman', serif",
      },
      ".markdown": {
        "div.end-p": {
          marginBottom: 4,
        },
        a: {
          color: "#8B4513",
          fontWeight: "500",
          _hover: {
            textDecoration: "underline",
            color: "#6B3410",
          },
        },
        p: {
          lineHeight: "1.8",
          marginY: 6,
          fontSize: "lg",
          color: "#374151",
        },
        "h1, h2, h3, h4, h5, h6": {
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700,
          marginTop: 8,
          marginBottom: 4,
          textOverflow: "ellipsis",
          lineHeight: "1.3",
          color: "#1F2937",
        },
        h1: {
          fontSize: "4xl",
        },
        h2: {
          fontSize: "3xl",
        },
        h3: {
          fontSize: "2xl",
        },
        h4: {
          fontSize: "xl",
        },
        h5: {
          fontSize: "lg",
        },
        h6: {
          fontSize: "md",
        },
        blockquote: {
          pl: 6,
          py: 2,
          my: 6,
          pos: "relative",
          fontStyle: "italic",
          color: "#4B5563",
          bg: "#F9F7F3",
          borderRadius: "md",
          _before: {
            content: "''",
            display: "block",
            pos: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "4px",
            bgColor: "#8B4513",
            borderRadius: "full",
          },
        },
        table: {
          maxWidth: "full",
          borderSpacing: 0,
          mt: 6,
          borderRadius: "md",
          overflow: "hidden",
          thead: {
            background: "#F5F1E8",
          },
          th: {
            fontWeight: 600,
            color: "#1F2937",
          },
          "th, td": {
            padding: "0.75em 1em",
            border: "1px solid #E5E1D8",
          },
        },
        "ol, ul": {
          padding: 0,
          fontSize: "lg",
        },
        li: {
          lineHeight: "1.8",
          marginLeft: 6,
          paddingLeft: 2,
          marginBottom: 3,
        },
      },
      "#nprogress": {
        pointerEvents: "none",
      },
      "#nprogress .bar": {
        background: "#8B4513",
        pos: "fixed",
        zIndex: 99999,
        top: 0,
        left: 0,
        width: "full",
        height: "3px",
      },
      ".nprogress-custom-parent": {
        overflow: "hidden",
        position: "absolute",
      },
    },
  },
})

export default theme
