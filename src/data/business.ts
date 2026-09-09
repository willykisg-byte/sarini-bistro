// Single source of truth for contact details, address, and hours.
// Update this file and it flows through the header, hero, footer, and
// the reservations/visit-us sections automatically.

export const business = {
  name: 'Sarini Bistro',
  address: 'Rubis, A1 Highway, Kitale, Jovenna',
  hours: {
    open: '6:00 AM',
    close: '8:30 PM',
    note: 'Open 7 days a week',
  },
  // TODO(Willy): email is still a placeholder — add it when you have one.
  phone: '+254 741 435933',
  email: '',
  whatsapp: '', // left blank on purpose — mostly phone calls for now
  location: {
    lat: 0.9960029,
    lng: 35.0044298,
    // The full Google Maps place link, for a "View on Google Maps" button
    googleMapsUrl:
      'https://www.google.com/maps/place/Sarini+Bistro/@0.9960029,35.0044298,17z',
  },
}

export function telHref() {
  return business.phone ? `tel:${business.phone}` : undefined
}

export function whatsappHref() {
  return business.whatsapp ? `https://wa.me/${business.whatsapp}` : undefined
}

export function directionsHref() {
  const { lat, lng } = business.location
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export function mapEmbedSrc() {
  const { lat, lng } = business.location
  return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`
}
