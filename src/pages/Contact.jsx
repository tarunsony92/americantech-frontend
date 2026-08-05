import { Helmet } from "react-helmet-async";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";

const Contact = () => (
  <>
    <Helmet><title>Contact Us | American FutureTech</title></Helmet>
    <PageHeader title="Contact Us" subtitle="We'd love to hear from you." breadcrumbItems={[{ label: "Contact" }]} />

    <section className="container-page grid grid-cols-1 gap-10 py-16 lg:grid-cols-2">
      <div>
        <h2 className="section-title">Get in Touch</h2>
        <div className="mt-6 space-y-4">
          <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><HiOutlineMail className="h-5 w-5 text-primary-600" /> info@americanfuturetechllc.com</p>
          <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><HiOutlineMail className="h-5 w-5 text-primary-600" /> support@americanfuturetechllc.com</p>
          <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><HiOutlinePhone className="h-5 w-5 text-primary-600" /> +91 92178 72078</p>
          <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><HiOutlineLocationMarker className="h-5 w-5 text-primary-600" /> 30 N Gould St Ste R Sheridan, WY 82801, USA</p>
        </div>
      </div>
      <ContactForm />
    </section>
  </>
);

export default Contact;
