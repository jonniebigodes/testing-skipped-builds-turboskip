export const allModes = {
  xsm: {
    /* viewport: 'xsm', */
    name: "XSmall",
    styles: { width: "320px", height: "900px" },
  },
  sm: {
    /* viewport: 'sm', */
    name: "Small",
    styles: { width: "640px", height: "900px" },
  },
  md: {
    /* viewport: 'md', */
    name: "Medium",
    styles: { width: "768px", height: "900px" },
  },
  xl: {
    /* viewport: 'xl', */
    name: "XL",
    styles: { width: "1280px", height: "900px" },
  },
  // Note, you can still specify the more
  // specific options listed in the section above
  /* specific: {
    viewport: {
      height: 600,
      width: 800,
    },
  },
  small: {
    name: 'Folded',
    styles: { width: '280px', height: '653px' },
  }, */
} as const;
