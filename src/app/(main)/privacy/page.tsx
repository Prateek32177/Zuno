export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 pb-30 mb-20 text-[#2f2721]">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-1 text-xs text-[#6f6258]">Last updated: 23 April 2026</p>

      <div className="mt-8 space-y-7 text-sm leading-6">
        {/* WHAT WE COLLECT */}
        <section>
          <h2 className="font-semibold text-base">What we collect</h2>
          <p className="mt-2">
            Zipout collects basic account information provided via Google
            sign-in (name, email, profile photo). We do not access any
            additional Google account data beyond what is required for
            authentication.
          </p>
          <p className="mt-2">
            We also collect content you create on the platform (plans,
            descriptions, messages), and usage data such as device type and app
            activity.
          </p>
          <p className="mt-2">
            If you choose to add a phone number, it is stored as part of your
            profile.
          </p>
        </section>

        {/* HOW WE USE */}
        <section>
          <h2 className="font-semibold text-base">How we use it</h2>
          <p className="mt-2">
            Your data is used solely to operate and improve the platform —
            displaying your profile, showing your plans, and enabling discovery
            by other users.
          </p>
          <p className="mt-2">
            Zipout does not sell your data to third parties. Zipout does not use
            your data for advertising or marketing purposes.
          </p>
        </section>

        {/* GOOGLE API COMPLIANCE */}
        <section>
          <h2 className="font-semibold text-base">
            Google API Services User Data
          </h2>
          <p className="mt-2">
            Zipout’s use and transfer of information received from Google APIs
            complies with the Google API Services User Data Policy, including
            Limited Use requirements.
          </p>
          <p className="mt-2">
            We only use Google user data for authentication and core application
            functionality. We do not use this data for advertising, profiling,
            or sharing with third parties.
          </p>
        </section>

        {/* DATA STORAGE */}
        <section>
          <h2 className="font-semibold text-base">Data storage</h2>
          <p className="mt-2">
            Your data is stored on secure third-party infrastructure, such as
            cloud hosting and database providers.
          </p>
          <p className="mt-2">
            Zipout takes reasonable steps to protect your data but cannot
            guarantee absolute security.
          </p>
        </section>

        {/* DATA RETENTION */}
        <section>
          <h2 className="font-semibold text-base">Data retention</h2>
          <p className="mt-2">
            We retain your data for as long as your account is active.
          </p>
          <p className="mt-2">
            If you request account deletion, your data will be permanently
            removed within a reasonable timeframe unless retention is required
            by law.
          </p>
        </section>

        {/* YOUR RIGHTS */}
        <section>
          <h2 className="font-semibold text-base">Your rights</h2>
          <p className="mt-2">
            You may request deletion of your account and associated data at any
            time through the app or by contacting us at{" "}
            <span className="font-medium">team.zipout@gmail.com</span>.
          </p>
          <p className="mt-2">
            We will process deletion requests in accordance with applicable
            laws.
          </p>
        </section>

        {/* LAW ENFORCEMENT */}
        <section>
          <h2 className="font-semibold text-base">Law enforcement</h2>
          <p className="mt-2">
            Zipout may retain and disclose data where required by Indian law or
            in response to valid legal process, including requests from law
            enforcement agencies.
          </p>
        </section>

        {/* COOKIES */}
        <section>
          <h2 className="font-semibold text-base">Cookies and tracking</h2>
          <p className="mt-2">
            Zipout does not use cookies or tracking technologies for advertising
            purposes.
          </p>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="font-semibold text-base">Contact</h2>
          <p className="mt-2">
            For privacy-related requests, account deletion, or support, contact
            us at <span className="font-medium">team.zipout@gmail.com</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
