Yes — here’s the revised architecture for **both** projects optimized for  **near-zero maintenance, minimal Supabase storage, and no paid file storage dependence** . Supabase’s free tier gives you 500 MB of Postgres database space and 1 GB of file storage, so the winning approach is to use Supabase as a  **thin decision layer** , not as a media or archive layer.  Google Search Console quotas are high enough for lightweight automated SEO pulls, and OpenAlex’s free-key daily usage is enough for a curated low-frequency ingest workflow if you keep ETF selective.**supabase**+3

## Core principle

For both systems, the right design is: **store the smallest useful record, re-fetch external data when needed, and only persist your own decisions.** That means you keep IDs, normalized metadata, scores, notes, and statuses in Supabase, while Google Search Console and OpenAlex remain the long-term upstream data sources.**developers.google**+2

---

## 6 Identities architecture

This one can be very close to “set it and mostly forget it” because the data is small, first-party, and stable. Google Search Console’s Search Analytics limits are far above what a single site needs for a weekly or daily opportunity workflow.[developers.google](https://developers.google.com/webmaster-tools/limits)

## What gets automated

* Scheduled GSC pull, daily or weekly.[developers.google](https://developers.google.com/webmaster-tools/limits)
* Query clustering into approved topic buckets.
* Opportunity scoring.
* Auto-flagging low CTR + position 8–30 opportunities.
* Auto-generating internal content briefs.
* Auto-archiving stale low-priority rows.

## What stays manual

* Final approval of what pages to write or update.
* Final public copy review.
* Deciding whether to merge similar opportunities.

## What to store in Supabase

Store only compact rows like:

* `query`
* `page`
* `date_bucket` or `week_start`
* `clicks`
* `impressions`
* `ctr`
* `position`
* `topic_bucket`
* `opportunity_score`
* `recommended_action`
* `status`

That is tiny text-plus-numeric data, so storage pressure is very low relative to a 500 MB free database.[supabase](https://supabase.com/pricing)

## What not to store

* Raw GSC response blobs
* Infinite daily history forever
* Full draft content versions
* File uploads
* Screenshots
* Media assets in Supabase Storage

## Best storage-saving rule

Keep only:

* 90 days of daily data
* then roll up to weekly or monthly summaries
* delete old raw snapshots after aggregation

That gives you trend continuity without endless row growth.

## Best workflow

<pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs"><div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtle"><button data-testid="copy-code-button" aria-label="Copy code" type="button" class="focus-visible:bg-quiet hover:bg-quiet text-quiet hover:text-foreground font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-square" data-state="closed"><div class="flex items-center min-w-0 gap-two justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg role="img" class="inline-flex fill-current shrink-0" width="16" height="16" stroke-width="1.75"><use xlink:href="#pplx-icon-copy"></use></svg></div></div></button></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin">text</div></div><div><span><code><span><span>Nightly cron
</span></span><span>→ pull top queries/pages from GSC
</span><span>→ normalize and dedupe
</span><span>→ score opportunities
</span><span>→ update existing rows instead of inserting duplicates where possible
</span><span>→ push only top items to internal review queue
</span><span>→ auto-expire old low-value rows</span></code></span></div></div></div></pre>

## Best table design

Use 3 lean tables, not 12:

* `gsc_query_snapshots`
* `content_opportunities`
* `content_pages`

That is enough for a practical MVP and keeps schema sprawl low.

## Net result

This system is **mostly evergreen** because once GSC is connected, it keeps feeding real search behavior into the opportunity engine without manual keyword research.  It is **minimal-storage** because you are only storing structured metrics and decisions, not large assets.**supabase**+1

---

## ETF Framework architecture

This one needs a stricter design so it does not become a bloated “research library.” OpenAlex should be treated as the external corpus, not something you copy wholesale into Supabase. OpenAlex requires a free API key and includes free daily usage, which is enough for a curated ingest system if you stay selective.**developers.openalex**+2

## What gets automated

* Weekly OpenAlex topic queries.[developers.openalex](https://developers.openalex.org/api-reference/works)
* Deduplication by DOI/OpenAlex ID.
* Lightweight metadata import.
* Unpaywall enrichment only when DOI exists. Unpaywall requires an email parameter.[unpaywall](https://unpaywall.org/products/api)
* Crossref fallback only if key metadata is missing.[crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
* Auto-scoring for ETF relevance and synthesis potential.
* Auto-surfacing records that deserve ETF commentary.

## What stays manual

* Writing ETF-added summary or relevance note.
* Approving any indexable page.
* Deciding which papers feed a topic synthesis page.

## What to store in Supabase

Store only this minimal layer:

* external IDs (`openalex_id`, `doi`)
* title
* compact author list
* journal
* year/date
* source URL
* OA URL if available
* topic bucket
* citation count
* ETF relevance score
* short ETF note
* status
* indexability flag

That is enough to build a useful curated system without storing full-text content or giant payloads.**developers.openalex**+1

## What not to store

* PDFs
* full OpenAlex raw JSON blobs
* full Crossref raw JSON blobs
* full Unpaywall payloads
* cached article pages
* copied abstracts at scale
* duplicated author/institution data unless truly needed

## Best storage-saving rule

ETF should use a  **rehydration model** :

* store only the normalized minimum
* re-fetch richer metadata from OpenAlex or Crossref on demand if a record is opened or refreshed
* persist only ETF’s unique layer: notes, summaries, buckets, statuses

That means Supabase stores your  **judgment** , not the world’s research archive.**developers.openalex**+1

## Best workflow

<pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs"><div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtle"><button data-testid="copy-code-button" aria-label="Copy code" type="button" class="focus-visible:bg-quiet hover:bg-quiet text-quiet hover:text-foreground font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-square" data-state="closed"><div class="flex items-center min-w-0 gap-two justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg role="img" class="inline-flex fill-current shrink-0" width="16" height="16" stroke-width="1.75"><use xlink:href="#pplx-icon-copy"></use></svg></div></div></button></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin">text</div></div><div><span><code><span><span>Weekly cron
</span></span><span>→ query OpenAlex for approved ETF topic searches
</span><span>→ import only top N relevant works
</span><span>→ dedupe by DOI/openalex_id
</span><span>→ enrich DOI records with Unpaywall
</span><span>→ run Crossref only for missing metadata
</span><span>→ score for ETF relevance + synthesis value
</span><span>→ surface top items in review queue
</span><span>→ keep raw imports internal or noindex by default
</span><span>→ only reviewed + ETF-enriched records become public candidates</span></code></span></div></div></div></pre>

## Best table design

Use only 4–5 lean tables:

* `research_items`
* `research_topics`
* `etf_notes`
* `topic_synthesis_pages`
* `review_queue`

Do **not** start with a giant relational scholarly graph. That is how you create maintenance and storage debt.

## Net result

This system becomes **mostly evergreen** because OpenAlex keeps supplying new literature, but Supabase stays light because you only persist ETF’s curation layer.  It is also safer for SEO because you are not programmatically indexing a huge library of thin pages. Google’s technical requirements and indexing guidance make it important to only expose pages that are crawlable, indexable, and actually useful.**developers.google**+3

---

## Architecture comparison

| Project       | External source                                                                             | Automation level                                                                                 | Supabase role                         | Biggest storage risk                      | Fix                                               |
| ------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| 6 Identities  | Google Search Console[developers.google](https://developers.google.com/webmaster-tools/limits) | Very high[developers.google](https://developers.google.com/webmaster-tools/limits)                  | Metrics + scoring + decisions         | Keeping too much history                  | Aggregate and delete raw snapshots                |
| ETF Framework | OpenAlex + Unpaywall + occasional Crossref**developers.openalex**+2                   | High but curated[developers.openalex](https://developers.openalex.org/api-reference/authentication) | Metadata + ETF notes + publish states | Treating Supabase like a document archive | Store IDs and summaries only, rehydrate on demand |

---

## Minimal schemas

## 6 Identities

<pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs"><div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtle"><button data-testid="copy-code-button" aria-label="Copy code" type="button" class="focus-visible:bg-quiet hover:bg-quiet text-quiet hover:text-foreground font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-square" data-state="closed"><div class="flex items-center min-w-0 gap-two justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg role="img" class="inline-flex fill-current shrink-0" width="16" height="16" stroke-width="1.75"><use xlink:href="#pplx-icon-copy"></use></svg></div></div></button></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin">sql</div></div><div><span><code><span><span class="token token">create</span><span></span><span class="token token">table</span><span> gsc_query_snapshots </span><span class="token token punctuation">(</span><span>
</span></span><span><span>  id uuid </span><span class="token token">primary</span><span></span><span class="token token">key</span><span></span><span class="token token">default</span><span> gen_random_uuid</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  query </span><span class="token token">text</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  page_url </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  bucket_date </span><span class="token token">date</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  clicks </span><span class="token token">int</span><span></span><span class="token token">default</span><span></span><span class="token token">0</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  impressions </span><span class="token token">int</span><span></span><span class="token token">default</span><span></span><span class="token token">0</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  ctr </span><span class="token token">numeric</span><span class="token token punctuation">(</span><span class="token token">6</span><span class="token token punctuation">,</span><span class="token token">4</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  avg_position </span><span class="token token">numeric</span><span class="token token punctuation">(</span><span class="token token">6</span><span class="token token punctuation">,</span><span class="token token">2</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  topic_bucket </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  created_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span>
</span></span><span><span></span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span>
</span><span><span></span><span class="token token">create</span><span></span><span class="token token">index</span><span> idx_gsc_query_date </span><span class="token token">on</span><span> gsc_query_snapshots </span><span class="token token punctuation">(</span><span>bucket_date</span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span><span></span><span class="token token">create</span><span></span><span class="token token">index</span><span> idx_gsc_query_text </span><span class="token token">on</span><span> gsc_query_snapshots </span><span class="token token punctuation">(</span><span>query</span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span>
</span><span><span></span><span class="token token">create</span><span></span><span class="token token">table</span><span> content_opportunities </span><span class="token token punctuation">(</span><span>
</span></span><span><span>  id uuid </span><span class="token token">primary</span><span></span><span class="token token">key</span><span></span><span class="token token">default</span><span> gen_random_uuid</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  query </span><span class="token token">text</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  page_url </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  topic_bucket </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  opportunity_score </span><span class="token token">int</span><span></span><span class="token token">default</span><span></span><span class="token token">0</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  recommended_action </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span></span><span class="token token">status</span><span></span><span class="token token">text</span><span></span><span class="token token">default</span><span></span><span class="token token">'new'</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  last_seen_at timestamptz</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  created_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  updated_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span>
</span></span><span><span></span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span>
</span><span><span></span><span class="token token">create</span><span></span><span class="token token">table</span><span> content_pages </span><span class="token token punctuation">(</span><span>
</span></span><span><span>  id uuid </span><span class="token token">primary</span><span></span><span class="token token">key</span><span></span><span class="token token">default</span><span> gen_random_uuid</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  slug </span><span class="token token">text</span><span></span><span class="token token">unique</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  title </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  topic_bucket </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span></span><span class="token token">status</span><span></span><span class="token token">text</span><span></span><span class="token token">default</span><span></span><span class="token token">'draft'</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  last_gsc_sync_at timestamptz</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  created_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  updated_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span>
</span></span><span><span></span><span class="token token punctuation">)</span><span class="token token punctuation">;</span></span></code></span></div></div></div></pre>

## ETF Framework

<pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs"><div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtle"><button data-testid="copy-code-button" aria-label="Copy code" type="button" class="focus-visible:bg-quiet hover:bg-quiet text-quiet hover:text-foreground font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-square" data-state="closed"><div class="flex items-center min-w-0 gap-two justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg role="img" class="inline-flex fill-current shrink-0" width="16" height="16" stroke-width="1.75"><use xlink:href="#pplx-icon-copy"></use></svg></div></div></button></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin">sql</div></div><div><span><code><span><span class="token token">create</span><span></span><span class="token token">table</span><span> research_items </span><span class="token token punctuation">(</span><span>
</span></span><span><span>  id uuid </span><span class="token token">primary</span><span></span><span class="token token">key</span><span></span><span class="token token">default</span><span> gen_random_uuid</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  openalex_id </span><span class="token token">text</span><span></span><span class="token token">unique</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  doi </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  title </span><span class="token token">text</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  authors jsonb</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  journal </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  publication_year </span><span class="token token">int</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  publication_date </span><span class="token token">date</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  source_url </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  open_access_url </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  is_open_access </span><span class="token token">boolean</span><span></span><span class="token token">default</span><span></span><span class="token token boolean">false</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  citation_count </span><span class="token token">int</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  topic_bucket </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  etf_score </span><span class="token token">int</span><span></span><span class="token token">default</span><span></span><span class="token token">0</span><span class="token token punctuation">,</span><span>
</span></span><span><span></span><span class="token token">status</span><span></span><span class="token token">text</span><span></span><span class="token token">default</span><span></span><span class="token token">'imported'</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  seo_indexable </span><span class="token token">boolean</span><span></span><span class="token token">default</span><span></span><span class="token token boolean">false</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  created_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  updated_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span>
</span></span><span><span></span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span>
</span><span><span></span><span class="token token">create</span><span></span><span class="token token">index</span><span> idx_research_doi </span><span class="token token">on</span><span> research_items </span><span class="token token punctuation">(</span><span>doi</span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span><span></span><span class="token token">create</span><span></span><span class="token token">index</span><span> idx_research_bucket </span><span class="token token">on</span><span> research_items </span><span class="token token punctuation">(</span><span>topic_bucket</span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span>
</span><span><span></span><span class="token token">create</span><span></span><span class="token token">table</span><span> etf_notes </span><span class="token token punctuation">(</span><span>
</span></span><span><span>  id uuid </span><span class="token token">primary</span><span></span><span class="token token">key</span><span></span><span class="token token">default</span><span> gen_random_uuid</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  research_item_id uuid </span><span class="token token">references</span><span> research_items</span><span class="token token punctuation">(</span><span>id</span><span class="token token punctuation">)</span><span></span><span class="token token">on</span><span></span><span class="token token">delete</span><span></span><span class="token token">cascade</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  relevance_note </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  etf_summary </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  practitioner_takeaway </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  reviewer </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  created_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  updated_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span>
</span></span><span><span></span><span class="token token punctuation">)</span><span class="token token punctuation">;</span><span>
</span></span><span>
</span><span><span></span><span class="token token">create</span><span></span><span class="token token">table</span><span> topic_synthesis_pages </span><span class="token token punctuation">(</span><span>
</span></span><span><span>  id uuid </span><span class="token token">primary</span><span></span><span class="token token">key</span><span></span><span class="token token">default</span><span> gen_random_uuid</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  slug </span><span class="token token">text</span><span></span><span class="token token">unique</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  title </span><span class="token token">text</span><span></span><span class="token token operator">not</span><span></span><span class="token token boolean">null</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  topic_bucket </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  summary </span><span class="token token">text</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  seo_indexable </span><span class="token token">boolean</span><span></span><span class="token token">default</span><span></span><span class="token token boolean">true</span><span class="token token punctuation">,</span><span>
</span></span><span><span></span><span class="token token">status</span><span></span><span class="token token">text</span><span></span><span class="token token">default</span><span></span><span class="token token">'draft'</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  created_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><span>
</span></span><span><span>  updated_at timestamptz </span><span class="token token">default</span><span></span><span class="token token">now</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span>
</span></span><span><span></span><span class="token token punctuation">)</span><span class="token token punctuation">;</span></span></code></span></div></div></div></pre>

These are intentionally lean. They avoid huge payload storage and still support evergreen workflows.

---

## Storage rules to enforce

Apply these to both projects:

* Never store files in Supabase unless absolutely necessary. Supabase free file storage is only 1 GB.[supabase](https://supabase.com/pricing)
* Never store full API payloads by default.
* Normalize repeated strings where useful, but do not over-engineer.
* Delete stale logs after 30–90 days.
* Keep one source-of-truth record per entity.
* Re-fetch enrichments when needed instead of caching everything forever.
* Use scheduled pruning jobs.

---

## Best cron strategy

Use low-frequency automation, not aggressive polling.

## 6 Identities

* Daily or 3x weekly GSC sync is enough.[developers.google](https://developers.google.com/webmaster-tools/limits)

## ETF Framework

* Weekly OpenAlex ingest is enough. OpenAlex free API usage is daily-metered, so there is no need to hammer it.**openalex**+1

That reduces runtime, noise, and storage churn.

---

## What “near-zero maintenance” really looks like

Here is the honest version:

## 6 Identities

You mostly review top surfaced opportunities and ignore the rest. This is close to true low-maintenance.[developers.google](https://developers.google.com/webmaster-tools/limits)

## ETF

You let automation discover and enrich papers, but you still only spend time on the few that deserve ETF commentary or synthesis. That means your effort goes into authority-building pages, not database housekeeping.**unpaywall**+1

---

## Final recommendation

If your goal is  **free, evergreen, low-touch, and small-storage** , then the final architecture should be:

* **6 Identities:** automated GSC opportunity engine with rolling metric retention and no file storage.**supabase**+1
* **ETF Framework:** automated OpenAlex discovery plus DOI/OA enrichment, but Supabase stores only a light curation layer and public value-added pages, not a full research archive.**developers.openalex**+2

If you want, I can next turn this into a  **single master Claude prompt that tells Claude to build both architectures exactly this way** .
