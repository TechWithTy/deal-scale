import { ContactInfo } from "@/components/contact/form/ContactInfo";
import ContactPilotForm from "@/components/contact/form/ContactPilotForm";
import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import Testimonials from "@/components/home/Testimonials";
import { pilotProgramSteps } from "@/data/service/slug_data/consultationSteps";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
// * Centralized SEO for /contact using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/contact");
	return mapSeoMetaToMetadata(seo);
}

const Contact = () => {
	return (
		<>
			<div className="container mx-auto px-6 py-24">
				<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<ContactPilotForm />
					</div>
					<div className="flex flex-col lg:col-span-5">
						<ScheduleMeeting />
						<ContactSteps steps={pilotProgramSteps} />
						<TrustedByMarquee items={companyLogos} />
						{/* <div className="relative w-full mt-10 overflow-hidden py-4 text-center bg-background-dark/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm animate-float">
              <Image
                src="/CyberOni-Wording_white.png"
                alt="CyberOni Logo"
                width={300}
                height={76}
                className="mx-auto glow-outline"
              />
            </div> */}
					</div>
				</div>
				<ContactInfo />

				<Testimonials
					testimonials={generalDealScaleTestimonials}
					title={"What Our Clients Say"}
					subtitle={
						"Hear from our clients about their experiences with our services"
					}
				/>
				<Newsletter />
			</div>
		</>
	);
};

export default Contact;
