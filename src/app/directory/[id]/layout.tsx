import type { Metadata } from 'next';
import { contractorsData } from '@/lib/contractors-data';
import { getStateName } from '@/lib/states-config';

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const contractor = contractorsData.find((c) => c.id === params.id);

  if (!contractor) {
    return {
      title: 'Contractor Not Found | SubPaid Directory',
      description: 'The requested contractor profile could not be found.',
    };
  }

  const stateName = getStateName(contractor.state);
  const payScoreText = contractor.payScore ? ` PayScore: ${contractor.payScore}/100.` : '';
  const reviewText = contractor.reviewCount ? ` ${contractor.reviewCount} reviews.` : '';

  return {
    title: `${contractor.businessName} - ${contractor.licenseType} in ${contractor.city}, ${contractor.state}`,
    description: `${contractor.businessName} is a licensed ${contractor.licenseType.toLowerCase()} in ${contractor.city}, ${stateName}.${payScoreText}${reviewText} License #${contractor.licenseNumber}. View contact info, license details, and reviews.`,
    keywords: [
      contractor.businessName,
      `${contractor.city} contractor`,
      `${stateName} contractor`,
      contractor.licenseType,
      'licensed contractor',
      'contractor reviews',
    ],
    alternates: {
      canonical: `https://subpaid-pwa.vercel.app/directory/${params.id}`,
    },
    openGraph: {
      title: `${contractor.businessName} | Licensed ${contractor.licenseType}`,
      description: `Licensed ${contractor.licenseType.toLowerCase()} in ${contractor.city}, ${stateName}. View PayScore, reviews, and contact information.`,
      url: `https://subpaid-pwa.vercel.app/directory/${params.id}`,
      type: 'profile',
    },
  };
}

// Generate static params for all contractors (improves build performance)
export async function generateStaticParams() {
  return contractorsData.map((contractor) => ({
    id: contractor.id,
  }));
}

export default function ContractorLayout({ children }: Props) {
  return children;
}
