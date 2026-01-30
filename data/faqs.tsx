// faqData.tsx

import { FAQSection } from "@/types";

export const faqData: FAQSection[] = [
  {
    category: "General Questions",
    items: [
      {
        question: "What is your company about?",
        answer: (
          <>
            <p>
              We provide innovative digital solutions to help businesses grow
              and thrive in the modern world.
            </p>
          </>
        ),
      },
      {
        question: "Where are you located?",
        answer: (
          <>
            <p>
              Our headquarters are in Bahawalpur, Pakistan, with remote teams
              across the globe.
            </p>
          </>
        ),
      },
      {
        question: "Do you operate internationally?",
        answer: (
          <>
            <p>
              Yes, we work with clients worldwide using online collaboration
              tools and platforms.
            </p>
          </>
        ),
      },
      {
        question: "What industries do you serve?",
        answer: (
          <>
            <p>
              We serve industries including education, e-commerce, healthcare,
              and finance.
            </p>
          </>
        ),
      },
      {
        question: "Can individuals also use your services?",
        answer: (
          <>
            <p>
              Absolutely. Our services are designed for both individuals and
              businesses.
            </p>
          </>
        ),
      },
      {
        question: "Do you offer free consultations?",
        answer: (
          <>
            <p>
              Yes, we provide a free 30-minute consultation session to
              understand your needs.
            </p>
          </>
        ),
      },
      {
        question: "What are your business hours?",
        answer: (
          <>
            <p>
              We are available Monday to Saturday, 9:00 AM to 6:00 PM (PKT).
            </p>
          </>
        ),
      },
      {
        question: "Do you provide custom solutions?",
        answer: (
          <>
            <p>
              Yes, we tailor each solution specifically to client requirements.
            </p>
          </>
        ),
      },
      {
        question: "Can I visit your office in person?",
        answer: (
          <>
            <p>
              Yes, you may visit us, but please schedule an appointment in
              advance.
            </p>
          </>
        ),
      },
      {
        question: "How can I contact support?",
        answer: (
          <>
            <p>
              You can reach us via email, live chat, or by filling out our
              contact form.
            </p>
          </>
        ),
      },
      {
        question: "Do you have a refund policy?",
        answer: (
          <>
            <p>
              Yes, refunds are available within 14 days of purchase under
              certain conditions.
            </p>
          </>
        ),
        isHighlighting:true
      },
      {
        question: "Are your services subscription-based?",
        answer: (
          <>
            <p>
              Some services are one-time purchases, while others follow a
              subscription model.
            </p>
          </>
        ),
      },
      {
        question: "Do you provide documentation?",
        answer: (
          <>
            <p>
              Yes, detailed guides, manuals, and documentation are included with
              all services.
            </p>
          </>
        ),
      },
      {
        question: "What makes you different from competitors?",
        answer: (
          <>
            <p>
              Our focus is on customer-centric, scalable, and affordable
              solutions with continuous support.
            </p>
          </>
        ),
      },
      {
        question: "Do you work with startups?",
        answer: (
          <>
            <p>Yes, we specialize in helping startups launch and grow.</p>
          </>
        ),
      },
      {
        question: "Do you provide after-sales support?",
        answer: (
          <>
            <p>
              Yes, ongoing maintenance and after-sales support are always part
              of our packages.
            </p>
          </>
        ),
      },
      {
        question: "Are your solutions mobile-friendly?",
        answer: (
          <>
            <p>
              Absolutely. All our solutions are responsive and optimized for
              mobile devices.
            </p>
          </>
        ),
      },
      {
        question: "Can I request custom features?",
        answer: (
          <>
            <p>
              Yes, we can design and implement custom features tailored to your
              needs.
            </p>
          </>
        ),
      },
      {
        question: "Do you have partnerships?",
        answer: (
          <>
            <p>
              Yes, we collaborate with technology partners, educational
              institutes, and industry experts.
            </p>
          </>
        ),
      },
      {
        question: "Can I get updates about your services?",
        answer: (
          <>
            <p>
              Yes, subscribe to our newsletter to stay updated with new features
              and offers.
            </p>
          </>
        ),
      },
    ],
  },

  {
    category: "Affiliate & Referrals",
    items: [
      {
        question: "How does the referral program work?",
        answer: (
          <p>
            You earn rewards by inviting friends to join the platform. Each time
            your referral invests, you get a percentage as commission.
          </p>
        ),
      },
      {
        question: "Where can I find my referral link?",
        answer: (
          <p>
            Your referral link is available on your dashboard under the
            ‘Affiliate’ section.
          </p>
        ),
      },
      {
        question: "Is there a limit to how many people I can refer?",
        answer: (
          <p>No, you can refer unlimited users and earn rewards from all.</p>
        ),
      },
      {
        question: "When will I receive referral commissions?",
        answer: (
          <p>
            Referral commissions are credited instantly once your referral makes
            a valid transaction.
          </p>
        ),
      },
      {
        question: "What percentage do I earn per referral?",
        answer: (
          <p>
            You earn between 5% and 10% depending on the mining plan your
            referral chooses.
          </p>
        ),
      },
      {
        question: "Do my referrals need to stay active?",
        answer: (
          <p>
            Yes, commissions are earned only on active and valid mining
            subscriptions.
          </p>
        ),
      },
      {
        question: "Can I track my referrals?",
        answer: (
          <p>
            Yes, you can see the number of referrals, their investments, and
            your total earnings in the affiliate dashboard.
          </p>
        ),
      },
      {
        question: "Do I get rewards if my referral refers others?",
        answer: (
          <p>
            Yes, our program supports multi-level rewards. You earn from both
            direct and indirect referrals.
          </p>
        ),
      },
      {
        question: "Is there a joining fee for affiliates?",
        answer: (
          <p>No, becoming an affiliate is free for all registered users.</p>
        ),
      },
      {
        question: "How do I withdraw my referral earnings?",
        answer: (
          <p>
            You can withdraw referral commissions directly into your wallet once
            you meet the minimum withdrawal limit.
          </p>
        ),
      },
      {
        question: "Do referral commissions expire?",
        answer: <p>No, commissions remain in your account until withdrawn.</p>,
      },
      {
        question: "What happens if my referral cancels their plan?",
        answer: (
          <p>
            You keep commissions for completed billing cycles, but future ones
            stop if the referral cancels.
          </p>
        ),
      },
      {
        question: "Can I promote my referral link on social media?",
        answer: (
          <p>
            Yes, you can share your link anywhere online as long as it complies
            with our marketing policy.
          </p>
        ),
      },
      {
        question: "Is there a leaderboard for top affiliates?",
        answer: (
          <p>
            Yes, top affiliates are featured on our leaderboard with special
            bonuses.
          </p>
        ),
      },
      {
        question: "Do referrals from different countries count?",
        answer: (
          <p>
            Yes, referrals are global. You earn commissions no matter where your
            referral is located.
          </p>
        ),
      },
      {
        question: "Can I lose my affiliate status?",
        answer: (
          <p>
            Affiliate accounts may be suspended for fraudulent activity or
            violating terms of service.
          </p>
        ),
      },
      {
        question: "Do I get notified of new referrals?",
        answer: (
          <p>
            Yes, you receive email notifications whenever someone joins through
            your link.
          </p>
        ),
      },
      {
        question: "Is there a mobile app to track referrals?",
        answer: (
          <p>
            Yes, you can monitor referrals and earnings directly from our mobile
            app.
          </p>
        ),
      },
      {
        question: "What currencies can I withdraw my referral earnings in?",
        answer: (
          <p>
            You can withdraw referral commissions in supported cryptocurrencies
            like BTC, ETH, or USDT.
          </p>
        ),
      },
      {
        question: "Do referrals help me unlock bonuses?",
        answer: (
          <p>
            Yes, the more referrals you bring, the higher tier bonuses and extra
            rewards you unlock.
          </p>
        ),
      },
    ],
  },

  {
    category: "Mining Plans",
    items: [
      {
        question: "What mining plans are available?",
        answer: (
          <p>
            We offer multiple GPU-based mining plans with varying hashrates,
            durations, and costs.
          </p>
        ),
      },
      {
        question: "Can I upgrade my mining plan anytime?",
        answer: (
          <p>Yes, you can upgrade instantly from your account dashboard.</p>
        ),
      },
      {
        question: "Is there a minimum investment?",
        answer: <p>Yes, the minimum investment depends on the chosen plan.</p>,
      },
      {
        question: "Do mining plans have fixed durations?",
        answer: (
          <p>
            Yes, each plan has a fixed duration (e.g., 30 days, 90 days, 1
            year).
          </p>
        ),
      },
      {
        question: "What happens when my plan expires?",
        answer: (
          <p>
            Once a plan expires, mining stops automatically and you can renew or
            purchase a new plan.
          </p>
        ),
      },
      {
        question: "Can I run multiple plans at once?",
        answer: (
          <p>Yes, you can purchase and manage multiple plans simultaneously.</p>
        ),
      },
      {
        question: "Do I need to configure hardware for my plan?",
        answer: (
          <p>
            No, all mining is cloud-based and managed by our infrastructure.
          </p>
        ),
      },
      {
        question: "Are there hidden fees in plans?",
        answer: (
          <p>
            No, all fees are transparent and shown before you confirm a
            purchase.
          </p>
        ),
      },
      {
        question: "How soon do I start earning after purchase?",
        answer: (
          <p>
            Mining rewards start accumulating within minutes after plan
            activation.
          </p>
        ),
      },
      {
        question: "Do mining rewards vary by plan?",
        answer: (
          <p>
            Yes, rewards depend on the plan’s hashrate, duration, and
            cryptocurrency mined.
          </p>
        ),
      },
      {
        question: "Can I cancel a mining plan?",
        answer: (
          <p>
            Mining plans cannot be canceled once purchased, but you can wait for
            them to expire.
          </p>
        ),
      },
      {
        question: "Are mining rewards fixed?",
        answer: (
          <p>
            No, rewards depend on network difficulty and cryptocurrency market
            prices.
          </p>
        ),
      },
      {
        question: "Can I pay for plans with crypto?",
        answer: (
          <p>
            Yes, we support Bitcoin, Ethereum, USDT, and other major
            cryptocurrencies.
          </p>
        ),
      },
      {
        question: "Do plans auto-renew?",
        answer: (
          <p>
            Plans do not auto-renew, but you can manually renew before expiry.
          </p>
        ),
      },
      {
        question: "How do I monitor my active plans?",
        answer: (
          <p>
            You can track hashrates, uptime, and earnings in your dashboard in
            real time.
          </p>
        ),
      },
      {
        question: "Is GPU maintenance included?",
        answer: (
          <p>
            Yes, all GPU maintenance, power costs, and cooling are covered by
            us.
          </p>
        ),
      },
      {
        question: "Do plans support multiple coins?",
        answer: (
          <p>
            Some plans allow multi-coin mining depending on the algorithm
            supported.
          </p>
        ),
      },
      {
        question: "Can I switch coins mid-plan?",
        answer: (
          <p>
            No, once a plan is activated, the mining algorithm is fixed for its
            duration.
          </p>
        ),
      },
      {
        question: "Is there a discount for long-term plans?",
        answer: (
          <p>Yes, annual and semi-annual plans come with discounted pricing.</p>
        ),
      },
      {
        question: "Do I keep full ownership of mined coins?",
        answer: (
          <p>
            Yes, all mined coins belong to you and are credited directly to your
            wallet.
          </p>
        ),
      },
    ],
  },

  {
    category: "Account & Registration",
    items: [
      {
        question: "How do I create an account?",
        answer: (
          <p>
            Sign up with your email, verify it, and set a secure password to
            start.
          </p>
        ),
      },
      {
        question: "Is phone verification required?",
        answer: (
          <p>
            Phone verification is optional but recommended for better account
            security.
          </p>
        ),
      },
      {
        question: "Can I use my social accounts to sign up?",
        answer: (
          <p>
            Yes, you can register using Google, Facebook, or your email address.
          </p>
        ),
      },
      {
        question: "What should I do if I forget my password?",
        answer: (
          <p>
            Use the “Forgot Password” link on the login page to reset your
            password.
          </p>
        ),
      },
      {
        question: "Can I change my registered email?",
        answer: (
          <p>
            Yes, you can update your email from account settings after verifying
            ownership.
          </p>
        ),
      },
      {
        question: "Is KYC verification mandatory?",
        answer: (
          <p>
            Yes, KYC is required for withdrawals to comply with regulations and
            ensure account safety.
          </p>
        ),
      },
      {
        question: "How do I update my personal details?",
        answer: (
          <p>
            You can update your name, address, and contact details under profile
            settings.
          </p>
        ),
      },
      {
        question: "Can I have multiple accounts?",
        answer: (
          <p>
            No, only one account per user is allowed according to our terms.
          </p>
        ),
      },
      {
        question: "How do I delete my account?",
        answer: (
          <p>
            You can request account deletion from the settings page or contact
            support.
          </p>
        ),
      },
      {
        question: "Do I need to be 18+ to register?",
        answer: (
          <p>Yes, you must be at least 18 years old to create an account.</p>
        ),
      },
      {
        question: "What if I don’t get the verification email?",
        answer: (
          <p>
            Check your spam folder, and if not found, request a new verification
            email.
          </p>
        ),
      },
      {
        question: "Can I enable 2FA on my account?",
        answer: (
          <p>
            Yes, we support two-factor authentication via authenticator apps for
            extra security.
          </p>
        ),
      },
      {
        question: "Can I login from multiple devices?",
        answer: (
          <p>
            Yes, but you may be required to confirm device login via email for
            security.
          </p>
        ),
      },
      {
        question: "How do I secure my account?",
        answer: (
          <p>
            Always use a strong password, enable 2FA, and don’t share login
            details with others.
          </p>
        ),
      },
      {
        question: "Can businesses create accounts?",
        answer: (
          <p>
            Yes, business and institutional accounts are supported with proper
            documentation.
          </p>
        ),
      },
      {
        question: "What languages are supported for registration?",
        answer: (
          <p>
            The platform currently supports English, Spanish, and several other
            languages.
          </p>
        ),
      },
      {
        question: "Do I need a crypto wallet to register?",
        answer: (
          <p>
            No, a built-in wallet is created automatically for each new user.
          </p>
        ),
      },
      {
        question: "Can I change my password anytime?",
        answer: (
          <p>
            Yes, you can change your password from the security settings page.
          </p>
        ),
      },
      {
        question: "What browsers are supported?",
        answer: (
          <p>
            The platform works best on Chrome, Firefox, Edge, and Safari latest
            versions.
          </p>
        ),
      },
      {
        question: "Is my account active immediately after signup?",
        answer: (
          <p>
            Yes, your account becomes active once you confirm your email
            address.
          </p>
        ),
      },
    ],
  },
  {
    category: "Payments & Billing",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: (
          <>
            <p>
              We accept credit cards, PayPal, bank transfers, and cryptocurrency
              payments.
            </p>
          </>
        ),
      },
      {
        question: "Do you offer installment plans?",
        answer: (
          <>
            <p>
              Yes, installment plans are available for large projects. Contact
              us for details.
            </p>
          </>
        ),
      },
      {
        question: "Is my payment secure?",
        answer: (
          <>
            <p>
              Yes, all payments are processed through encrypted gateways with
              PCI compliance.
            </p>
          </>
        ),
      },
      {
        question: "Do you charge VAT or taxes?",
        answer: (
          <>
            <p>Taxes may apply depending on your country’s regulations.</p>
          </>
        ),
      },
      {
        question: "Can I get an invoice?",
        answer: (
          <>
            <p>
              Yes, invoices are automatically generated and sent to your email.
            </p>
          </>
        ),
      },
      {
        question: "Do you offer student discounts?",
        answer: (
          <>
            <p>
              Yes, verified students can get up to 20% discount on selected
              services.
            </p>
          </>
        ),
      },
      {
        question: "Can I pay in cryptocurrency?",
        answer: (
          <>
            <p>Yes, we accept Bitcoin, Ethereum, and stablecoins as payment.</p>
          </>
        ),
      },
      {
        question: "Do you have a refund guarantee?",
        answer: (
          <>
            <p>
              Yes, refunds are available under our 14-day policy if conditions
              are met.
            </p>
          </>
        ),
      },
      {
        question: "Can I switch my subscription plan?",
        answer: (
          <>
            <p>
              Yes, you can upgrade or downgrade your plan anytime via the
              dashboard.
            </p>
          </>
        ),
      },
      {
        question: "Do you send payment reminders?",
        answer: (
          <>
            <p>
              Yes, automated reminders are sent before due dates to avoid
              service interruptions.
            </p>
          </>
        ),
      },
      {
        question: "Do you charge hidden fees?",
        answer: (
          <>
            <p>
              No, all fees are transparently displayed before you confirm a
              payment.
            </p>
          </>
        ),
      },
      {
        question: "What currencies do you support?",
        answer: (
          <>
            <p>
              We support USDT and major international currencies.
            </p>
          </>
        ),
        isHighlighting:true
      },
      {
        question: "Can I pay annually?",
        answer: (
          <>
            <p>Yes, you can choose annual billing for additional discounts.</p>
          </>
        ),
         isHighlighting:true
      },
      {
        question: "What happens if a payment fails?",
        answer: (
          <>
            <p>
              You’ll be notified immediately, and services may pause until
              payment is successful.
            </p>
          </>
        ),
      },
      {
        question: "Can I change my billing details?",
        answer: (
          <>
            <p>
              Yes, billing details can be updated anytime in your account
              settings.
            </p>
          </>
        ),
      },
      {
        question: "Do you support recurring billing?",
        answer: (
          <>
            <p>
              Yes, subscriptions are billed automatically at the chosen
              interval.
            </p>
          </>
        ),
      },
      {
        question: "Can I pause my subscription?",
        answer: (
          <>
            <p>Yes, subscriptions can be paused for up to 3 months.</p>
          </>
        ),
      },
      {
        question: "Do you provide receipts?",
        answer: (
          <>
            <p>
              Yes, receipts are emailed instantly after successful payments.
            </p>
          </>
        ),
      },
      {
        question: "Can I have multiple payment methods?",
        answer: (
          <>
            <p>
              Yes, you can store multiple payment options and choose your
              default.
            </p>
          </>
        ),
      },
      {
        question: "Is there a late payment fee?",
        answer: (
          <>
            <p>
              Yes, a small late fee may apply if invoices remain unpaid after
              the due date.
            </p>
          </>
        ),
      },
    ],
  },

  {
    category: "Technical Support",
    items: [
      {
        question: "How do I contact technical support?",
        answer: (
          <>
            <p>
              You can reach technical support via live chat, email, or ticket
              system in your account.
            </p>
          </>
        ),
      },
      {
        question: "What are support hours?",
        answer: (
          <>
            <p>
              Our technical support is available 24/7 for urgent issues and
              business hours for general queries.
            </p>
          </>
        ),
      },
      {
        question: "Do you offer remote troubleshooting?",
        answer: (
          <>
            <p>
              Yes, our team can remotely diagnose and fix many issues securely.
            </p>
          </>
        ),
      },
      {
        question: "Do you provide training?",
        answer: (
          <>
            <p>
              Yes, training materials and one-on-one sessions are available for
              teams.
            </p>
          </>
        ),
      },
      {
        question: "Can I request a feature update?",
        answer: (
          <>
            <p>
              Yes, feature requests are welcome and reviewed by our product
              team.
            </p>
          </>
        ),
      },
      {
        question: "What is the average response time?",
        answer: (
          <>
            <p>
              Most tickets are answered within 2 hours during business days.
            </p>
          </>
        ),
      },
      {
        question: "Do you provide software updates?",
        answer: (
          <>
            <p>
              Yes, updates are rolled out regularly and are included in your
              subscription.
            </p>
          </>
        ),
      },
      {
        question: "What if I encounter a bug?",
        answer: (
          <>
            <p>
              Please report bugs immediately via the ticket system so we can
              investigate and fix them quickly.
            </p>
          </>
        ),
      },
      {
        question: "Do you support integrations?",
        answer: (
          <>
            <p>
              Yes, we help with integrations like APIs, third-party tools, and
              plugins.
            </p>
          </>
        ),
      },
      {
        question: "Can you recover lost data?",
        answer: (
          <>
            <p>
              Yes, depending on the backup policy, data recovery is possible in
              most cases.
            </p>
          </>
        ),
      },
      {
        question: "Do you provide system monitoring?",
        answer: (
          <>
            <p>
              Yes, proactive monitoring tools help detect and fix issues before
              they affect you.
            </p>
          </>
        ),
      },
      {
        question: "Can you handle scaling issues?",
        answer: (
          <>
            <p>
              Yes, our experts help optimize performance and scale your systems
              efficiently.
            </p>
          </>
        ),
      },
      {
        question: "Is emergency support available?",
        answer: (
          <>
            <p>
              Yes, we provide 24/7 emergency support for critical system
              failures.
            </p>
          </>
          
        ), isHighlighting:true
      },
      {
        question: "Do you support mobile apps?",
        answer: (
          <>
            <p>
              Yes, we provide mobile troubleshooting and app updates when
              needed.
            </p>
          </>
        ),
      },
      {
        question: "How do I escalate an issue?",
        answer: (
          <>
            <p>
              Escalation options are available within the support portal if your
              case needs urgent attention.
            </p>
          </>
        ),
      },
      {
        question: "Do you provide uptime guarantees?",
        answer: (
          <>
            <p>Yes, most of our services come with a 99.9% uptime SLA.</p>
          </>
        ),
      },
      {
        question: "Can I integrate third-party APIs?",
        answer: (
          <>
            <p>
              Yes, we support custom integrations for APIs with full
              documentation.
            </p>
          </>
        ),
      },
      {
        question: "Do you provide security patches?",
        answer: (
          <>
            <p>
              Yes, security patches are applied regularly to protect systems.
            </p>
          </>
        ),
      },
      {
        question: "Can you help with server setup?",
        answer: (
          <>
            <p>
              Yes, our team provides complete setup, configuration, and
              optimization.
            </p>
          </>
        ),
      },
      {
        question: "Do you support cloud platforms?",
        answer: (
          <>
            <p>
              Yes, we support AWS, Google Cloud, Azure, and other platforms.
            </p>
          </>
        ),
      },
    ],
  },
];
