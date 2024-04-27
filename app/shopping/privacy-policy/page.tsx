export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col justify-start items-start gap-2 p-4">
      <h3 className="text-xl font-semibold">Privacy Policy</h3>
      <p className="text-slate-600">
        This Privacy Policy describes how{" "}
        <span className="font-semibold text-back dark:text-white">
          Afghan Crunchy Dry Fruits
        </span>{" "}
        we collects, uses, and shares information when you use our website
        http://localhost:3000 (the "Site").
      </p>
      <h3 className="text-xl font-semibold">Information We Collect</h3>
      <li className="text-slate-600">
        <h3 className="text-base font-semibold text-back dark:text-white">
          Personal Information:
        </h3>
        <p className="text-slate-600">
          When you visit our Site, we may collect certain personal information
          such as your name, email address, postal address, and phone number if
          you choose to provide it to us.
        </p>{" "}
      </li>
      <li className="text-slate-600">
        <h3 className="text-base font-semibold text-back dark:text-white">
          {" "}
          Usage Information:
        </h3>
        <p className="text-slate-600">
          We may also collect non-personal information about your visit to our
          Site, including the pages you view, the links you click, and other
          actions taken within our Site.
        </p>
      </li>
      <h3 className="text-xl font-semibold">How We Use Your Information</h3>
      <li className="text-slate-600">
        We may use the personal information we collect to:
      </li>
      <ul className="ml-8 list-disc">
        <li className="text-slate-600">Provide and improve our services;</li>
        <li className="text-slate-600">
          {" "}
          Communicate with you about your account or transactions;
        </li>
        <li className="text-slate-600">
          {" "}
          Respond to your inquiries and provide support;
        </li>
        <li className="text-slate-600">
          Send you promotional offers and marketing communications.
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Information Sharing</h3>
      We may share your personal information with:{" "}
      <li className="text-slate-600">
        Third-party service providers who assist us in operating our website,
        conducting our business, or servicing you;
      </li>
      <li className="text-slate-600">
        {" "}
        Law enforcement or regulatory authorities when required to do so by law.
      </li>
      <h3 className="text-xl font-semibold">Cookies</h3>
      <li className="text-slate-600">
        Our Site may use cookies to collect information and enhance your
        experience. You can choose to disable cookies through your browser
        settings, but this may affect certain functionality of our Site.
      </li>
      <h3 className="text-xl font-semibold">Third-Party Links</h3>
      <li className="text-slate-600">
        Our Site may contain links to third-party websites that are not operated
        by us. We have no control over, and assume no responsibility for, the
        content, privacy policies, or practices of any third-party websites or
        services.
      </li>
      <h3 className="text-xl font-semibold">Data Security</h3>
      <li className="text-slate-600">
        We take reasonable precautions to protect your personal information from
        unauthorized access, use, or disclosure. However, no method of
        transmission over the internet or electronic storage is 100% secure.
      </li>
      <h3 className="text-xl font-semibold">Changes to This Privacy Policy</h3>
      <li className="text-slate-600">
        We may update our Privacy Policy from time to time. Any changes will be
        posted on this page with a revised effective date.
      </li>
      <h3 className="text-xl font-semibold">Contact Us</h3>
      <li className="text-slate-600">
        If you have any questions about this Privacy Policy, please contact us
        at muzamilshahqurishy782787@gmail.com.
      </li>
    </div>
  );
}
