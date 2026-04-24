// Central event-name and payload-key constants for GA4 instrumentation.
// Single source of truth so dashboards + funnels can reference stable names.

export const EVENTS = {
  // Assessment funnel
  ASSESSMENT_STARTED: 'assessment_started',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  ASSESSMENT_SHARED: 'assessment_shared',
  ASSESSMENT_SOURCE: 'assessment_source',
  ASSESSMENT_STEP_VIEWED: 'assessment_step_viewed',
  ASSESSMENT_STEP_COMPLETED: 'assessment_step_completed',
  ASSESSMENT_STEP_ABANDONED: 'assessment_step_abandoned',
  ASSESSMENT_VALIDATION_ERROR: 'assessment_validation_error',

  // Landing + type pages
  LANDING_CTA_SELECTED: 'landing_cta_selected',
  LANDING_SECTION_VIEWED: 'landing_section_viewed',
  TYPE_PAGE_VIEWED: 'type_page_viewed',
  TYPE_PAGE_CTA_SELECTED: 'type_page_cta_selected',

  // Results engagement
  RESULTS_VIEWED: 'results_viewed',
  RESULTS_SECTION_VIEWED: 'results_section_viewed',
  RESULTS_RETURN_VISIT: 'results_return_visit',
  LOCKED_FEATURE_CLICKED: 'locked_feature_clicked',
  UPGRADE_CTA_SELECTED: 'upgrade_cta_selected',

  // Upsell
  UPSELL_VIEWED: 'upsell_viewed',
  UPSELL_CLICKED: 'upsell_clicked',

  // Checkout + payment
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_SESSION_CREATED: 'checkout_session_created',
  CHECKOUT_SESSION_CANCELED: 'checkout_session_canceled',
  CHECKOUT_SESSION_FAILED: 'checkout_session_failed',
  PAYMENT_FAILED: 'payment_failed',
  PURCHASE_COMPLETED: 'purchase_completed',

  // Certification funnel
  CERT_STARTED: 'certification_started',
  CERT_MODULE_VIEWED: 'certification_module_viewed',
  CERT_MODULE_COMPLETED: 'certification_module_completed',
  CERT_QUIZ_STARTED: 'certification_quiz_started',
  CERT_QUIZ_COMPLETED: 'certification_quiz_completed',
  CERT_QUIZ_PASSED: 'certification_quiz_passed',
  CERT_QUIZ_FAILED: 'certification_quiz_failed',
  CERT_COMPLETED: 'certification_completed',

  // Share + referral
  NEWSLETTER_GATE_SHOWN: 'newsletter_gate_shown',
  NEWSLETTER_GATE_SUBSCRIBED: 'newsletter_gate_subscribed',
  NEWSLETTER_GATE_DISMISSED: 'newsletter_gate_dismissed',
  REFERRAL_LINK_GENERATED: 'referral_link_generated',
  REFERRAL_LINK_SHARED: 'referral_link_shared',
  REFERRAL_LANDING_VIEWED: 'referral_landing_viewed',
  REFERRAL_CONVERSION: 'referral_conversion',
  REFERRAL_UNLOCK_PROGRESS: 'referral_unlock_progress',
  TEAMMATE_SHARE_PROMPTED: 'teammate_share_prompted',
  TEAMMATE_SHARE_COMPLETED: 'teammate_share_completed',
  GUIDE_UNLOCKED: 'guide_unlocked',

  // Practitioner
  PORTAL_TRIAL_STARTED: 'portal_trial_started',

  // Books + research + newsletter (Phase 2)
  BOOK_SALES_PAGE_VIEWED: 'book_sales_page_viewed',
  BOOK_CHECKOUT_STARTED: 'book_checkout_started',
  BOOK_PURCHASE_COMPLETED: 'book_purchase_completed',
  RESEARCH_GATE_SHOWN: 'research_gate_shown',
  RESEARCH_EMAIL_CAPTURED: 'research_email_captured',
  RESEARCH_PDF_DOWNLOADED: 'research_pdf_downloaded',
  NEWSLETTER_INLINE_SUBMITTED: 'newsletter_inline_submitted',

  // Consent (GDPR/CCPA — Consent Mode v2)
  CONSENT_ACCEPTED: 'consent_accepted',
  CONSENT_DENIED: 'consent_denied',

  // Errors
  ERROR_404: 'error_404',
  ERROR_BOUNDARY_HIT: 'error_boundary_hit',
  API_ERROR: 'api_error',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// Cross-brand ecosystem transitions (6identities ↔ etfframework). Keep string
// values verbatim — site-side GA4 dashboards depend on these literals.
export const ECOSYSTEM_EVENTS = {
  SIX_I_TO_ETF_TRANSITION: 'ecosystem_6i_to_etf_transition',
  ETF_TO_SIX_I_TRANSITION: 'ecosystem_etf_to_6i_transition',
} as const;

export type EcosystemEventName =
  (typeof ECOSYSTEM_EVENTS)[keyof typeof ECOSYSTEM_EVENTS];

export const KEYS = {
  source: 'source',
  page: 'page',
  accessLevel: 'access_level',
  pattern: 'pattern_type',
  productKey: 'product_type',
  price: 'price',
  currency: 'currency',
  step: 'step',
  questionIndex: 'question_index',
  referralMethod: 'method',
  referralCode: 'referral_code',
  sectionId: 'section_id',
  fromSection: 'from_section',
  ctaId: 'cta_id',
  destination: 'destination',
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmContent: 'utm_content',
  utmTerm: 'utm_term',
  referrer: 'referrer',
  landingPath: 'landing_path',
  errorType: 'error_type',
  errorMessage: 'error_message',
  endpoint: 'endpoint',
  statusCode: 'status_code',
  moduleNumber: 'module_number',
  score: 'score',
  totalScore: 'total_score',
  field: 'field',
  reason: 'reason',
  invitesSent: 'invites_sent',
  bookSlug: 'book_slug',
} as const;
