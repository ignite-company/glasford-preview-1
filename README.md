# Glasford Tree Trimming & Landscape Website

Approved **Preview 2** was retained as the sole design. The former three-preview selector and other concepts are gone from the current live site, although previous work remains in Git history.

## Pages and site structure

- `/`: Original approved editorial homepage, updated with 11 distinct photos that correspond to the surrounding copy.
- `/services/`: Overview of available tree-care services.
- `/services/tree-trimming/`: Tree trimming detail.
- `/services/tree-removal/`: Tree removal detail.
- `/services/tree-pruning/`: Tree pruning detail.
- `/service-areas/`: Where services may be available.
- `/service-areas/port-st-lucie/`: Port St. Lucie page.
- `/service-areas/west-palm-beach/`: West Palm Beach page.
- `/about/`: Business approach.
- `/gallery/`: Clearly labeled illustrative stock imagery.
- `/contact/`: Estimate information and contact page. The intake workflow is **not connected** yet.

## Search readiness

The site now has original text for the relevant service and service-area pages, unique titles/descriptions, canonical links, internal navigation and footer links, page-specific image alt text, Organization/Breadcrumb structured data without a private street address, `robots.txt`, and `sitemap.xml`.

**The site's pages remain `noindex,follow` intentionally.** The site should not be submitted for public indexing until:
1. Real, approved customer testimonials replace the six explicit sample reviews on the homepage.
2. A verified business phone/email and working estimate flow are installed.
3. The business approves the final coverage areas, business name and service scope.
4. The stock images are approved for use or replaced with authorized Glasford work photos.
5. The final live domain is chosen, then the canonical links, sitemap and structured-data URLs are updated accordingly.
6. The pages are QA-tested on real devices and their index robots directives switched to `index,follow`.

Stock images come from Pexels and are **not** represented as Glasford's completed projects. Do not add false review stars or aggregate ratings to structured data.

## Implementation & deployment

- Source: `ignite-company/glasford-preview-1`.
- Vercel project: `glasford-preview-1-nerb`.
- Current URL: https://glasford-preview-1-nerb.vercel.app/
- Static HTML and inline CSS/JavaScript. New pages are directory-based `index.html` files.
- No business owner's home or street address has been published.

## Notes

Port St. Lucie is in St. Lucie County. West Palm Beach is in Palm Beach County. Copy distinguishes the two areas; coverage outside them is described as subject to confirmation.
