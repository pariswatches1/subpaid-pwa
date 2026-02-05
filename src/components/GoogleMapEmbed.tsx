'use client';

interface GoogleMapEmbedProps {
  address: string;
  height?: number;
  zoom?: number;
  className?: string;
}

export function GoogleMapEmbed({ address, height = 400, zoom = 15, className = '' }: GoogleMapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';
  const encodedAddress = encodeURIComponent(address);

  if (!apiKey) {
    return (
      <div
        className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-gray-400 text-sm">Map unavailable — API key not configured</p>
      </div>
    );
  }

  return (
    <iframe
      width="100%"
      height={height}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=${zoom}`}
      className={`rounded-xl ${className}`}
    />
  );
}
