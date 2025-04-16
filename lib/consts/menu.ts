export type AnchorItem = {
  title: string;
  href: string;
  children?: AnchorItem[];
};

export type AnchorListItem = {
  title: string;
  children?: AnchorItem[];
  image?: string;
  key?: string;
  href?: string;
};
export const anchorList: AnchorListItem[] = [
  {
    title: "Bespoke",
    children: [
      {
        title: "TAILORING",
        href: "/bespoke/tailoring",
        children: [
          {
            title: "Bespoke Tailoring",
            href: "/bespoke/tailoring",
          },
          {
            title: "Bespoke Shirts",
            href: "/bespoke/shirts",
          },
          {
            title: "Bespoke Trousers",
            href: "/bespoke/trousers",
          },
        ],
      },
      {
        title: "BESPOKE WOMENSWEAR",
        href: "/bespoke/womenswear",
        children: [
          {
            title: "Bespoke For Womenswear",
            href: "/bespoke/womenswear",
          },
        ],
      },
    ],
    key: "bespoke",
    image:
      "https://www.huntsmansavilerow.com/cdn/shop/files/Loro_Piana_070_1500x.jpg?v=1714661782",
  },
  {
    title: "Ready To Wear",
    children: [
      {
        title: "TAILORING & CASUALWEAR",
        href: "/collections/new-arrivals",
        children: [],
      },
      {
        title: "TAILORING & CASUALWEAR",
        href: "/collections/new-arrivals",
        children: [],
      },
    ],
    key: "ready-to-wear",
    image:
      "https://www.huntsmansavilerow.com/cdn/shop/files/Loro_Piana_070_1500x.jpg?v=1714661782",
  },
  {
    title: "Weddings",
    children: [
      {
        title: "Collections",
        href: "/weddings/collections",
        children: [
          {
            title: "Collections",
            href: "/weddings/collections",
          },
        ],
      },
      {
        title: "Guide",
        href: "/weddings/guide",
        children: [
          {
            title: "Guide",
            href: "/weddings/guide",
          },
        ],
      },
    ],
    key: "weddings",
    image:
      "https://www.huntsmansavilerow.com/cdn/shop/files/Loro_Piana_070_1500x.jpg?v=1714661782",
  },
  {
    title: "Uniform & Partnership",
    key: "uniform-partnership",
    children: [
      {
        title: "Formal",
        href: "/uniforms/formal",
        children: [
          {
            title: "Formal",
            href: "/uniforms/formal",
          },
          {
            title: "Casual",
            href: "/uniforms/casual",
          },
        ],
      },
      {
        title: "Policy",
        href: "/uniforms/policy",
        children: [
          {
            title: "Policy",
            href: "/uniforms/policy",
          },
        ],
      },
    ],
    image:
      "https://www.huntsmansavilerow.com/cdn/shop/files/Loro_Piana_070_1500x.jpg?v=1714661782",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];
