import { extendTheme } from "@chakra-ui/react"

import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

import { Button } from "./button";

export const theme = extendTheme({
    colors: {
        brand: {
            100: "#1A83A8",
        },
    },
    fonts: {
        body: "Open Sans, sans-serif",
    },
    styles: {
        global: () => ({
            body: {
                bg: "#CDF6F9",
            },
        }),
    },
    components: {
        Button,
    },
})
