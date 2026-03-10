import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = "917022653390";
  const defaultMessage = "Hello, I am interested in your jewellery collection.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center hover:shadow-[#25D366]/50"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
