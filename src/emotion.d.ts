import "@emotion/react";
import type { AppTheme } from "./tokens/theme";

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
