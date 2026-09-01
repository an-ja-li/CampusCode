import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | CampusCode",
  description: "Terms and conditions governing marketplace purchases, escrow contracts, and user conduct on CampusCode.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <FileText className="h-6 w-6" />
            <span className="font-semibold text-sm">User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Terms of Service</h1>
          <p className="text-xs text-[var(--muted-foreground)]">Effective Date: September 1, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-[var(--muted-foreground)]">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CampusCode (&quot;the Platform&quot;), whether as a student developer, employer client, or marketplace buyer, you agree to be legally bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">2. Student Developer Eligibility & Conduct</h2>
            <p>
              Student accounts must represent real individuals currently enrolled or recently graduated from recognized educational institutions. Developers warrant that all source code, software packages, templates, and milestone deliverables submitted are original works or compliant with open-source licenses. Plagiarism or malicious code injection will result in immediate termination of the account and forfeiture of pending balances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">3. Marketplace Purchases & Instant Delivery</h2>
            <p>
              When purchasing software on CampusCode, buyers receive an instant digital license and immediate access to source archives and repository download links. Due to the digital nature of instant source code delivery, sales are final except in cases of verified defective code unresolvable by the creator.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">4. Escrow & Milestone Payments</h2>
            <p>
              For custom project solutions, clients deposit project funds into an escrow account. Milestone disbursements are released upon client approval of deliverables or upon successful dispute resolution. The platform fee for custom contracts is 10%, with 90% disbursed directly to the developer upon milestone approval.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">5. Governing Law & Dispute Resolution</h2>
            <p>
              These terms are governed by the laws of India. Any legal disputes arising out of the use of the platform shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
