/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// To make sure SSR has the right theme
import RootWrapper from "./src/components/ui/root-wrapper"
export const wrapRootElement = RootWrapper
