import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | American Tech Global</title>
      </Helmet>
      <PageHeader
        title="Terms & Conditions"
        breadcrumbItems={[{ label: "Terms & Conditions" }]}
      />

      <section className="container-page max-w-3xl py-16 space-y-8 text-slate-700 dark:text-slate-300">
        <p>
          Welcome to <strong>American Tech Global LLC</strong> ("Company," "we,"
          "our," or "us"). We value the privacy and security of every visitor,
          student, prospective student, and user ("you" or "your") who
          interacts with our website and services.
        </p>

        <p>
          This page explains how we gather, use, share, and protect your
          information when you visit our website at{" "}
          <a
            href="https://americantechgloballlc.com/"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            americantechgloballlc.com
          </a>{" "}
          and use our courses, training programs, and related services
          (together, the "Services").
        </p>

        <p>
          By using our Website and Services, you accept the practices
          described below. If you disagree with any part of this policy,
          please stop using the Website and Services.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p>
            We collect information you give us directly, along with certain
            data gathered automatically as you use the Website.
          </p>

          <h3 className="font-medium mt-4 mb-1">A. Information you provide</h3>
          <p>We may collect personal details when you:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Register or enroll in a course or program</li>
            <li>Submit an inquiry or contact form</li>
            <li>Sign up for newsletters or updates</li>
            <li>Communicate with us through the Website</li>
          </ul>
          <p className="mt-2">This may include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing or payment details, where applicable</li>
            <li>Any other information you choose to share with us</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">B. Information collected automatically</h3>
          <p>While you browse the Website, we may automatically gather:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address</li>
            <li>Browser and device information</li>
            <li>Pages visited and activity on the site</li>
            <li>Date, time, and duration of your visits</li>
            <li>Referring and exit pages</li>
          </ul>
          <p className="mt-2">
            This data is typically gathered using cookies, analytics tools,
            and similar tracking technologies.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To operate, manage, and improve our Services</li>
            <li>To process enrollments, registrations, and payments</li>
            <li>To respond to inquiries and provide support</li>
            <li>To send updates, notifications, newsletters, and promotions</li>
            <li>To understand site usage and improve user experience</li>
            <li>To maintain security, prevent fraud, and meet legal obligations</li>
          </ul>
          <p className="mt-2">
            We do not sell, rent, or trade your personal information to third
            parties without your consent, except where the law requires it or
            it is necessary to deliver our Services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Cookies & Tracking</h2>
          <p>Cookies and similar technologies may be used to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Improve site functionality and performance</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze traffic and user behavior</li>
            <li>Enhance the overall browsing experience</li>
          </ul>
          <p className="mt-2">
            You can disable cookies in your browser settings, though some
            features of the Website may stop working properly as a result.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
          <p>We may share your data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Service providers and partners who help run our website, courses, and services</li>
            <li>Legal or government authorities, when required by law</li>
            <li>Third-party tools used for payments, communication, or our learning platform</li>
            <li>Other parties, with your consent or as needed to fulfill your request</li>
          </ul>
          <p className="mt-2">
            We take reasonable steps to protect shared information, but we
            are not responsible for the privacy practices of third-party
            sites or tools linked from our platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p>
            American Tech Global LLC applies reasonable technical and
            administrative safeguards to protect your information from
            unauthorized access, misuse, disclosure, or loss. No method of
            online transmission or storage is completely secure, so absolute
            protection cannot be guaranteed. You are responsible for keeping
            your account credentials confidential.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Your Privacy Rights</h2>
          <p>Subject to applicable law, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal information</li>
            <li>Request corrections or updates to your data</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of promotional communications</li>
            <li>Ask how your data is being used</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please reach out through our
            official contact channels.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
          <p>
            Our Website and Services are meant for individuals aged 13 and
            above. We do not knowingly collect information from children
            under 13. If we discover such information, we will take
            appropriate steps to remove it in line with applicable law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Any changes take
            effect once the revised version is posted on this page along
            with an updated date. Continuing to use the Website and Services
            after changes are posted means you accept the updated policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have questions about this policy or want to exercise your
            rights, please contact us:
          </p>
          <p className="mt-2">
            <strong>American Tech Global LLC</strong>
            <br />
            Email:{" "}
            <a href="mailto:info@americantechgloballlc.com" className="text-primary underline">
              info@americantechgloballlc.com
            </a>
            <br />
            Website:{" "}
            <a
              href="https://americantechgloballlc.com/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              americantechgloballlc.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditions;