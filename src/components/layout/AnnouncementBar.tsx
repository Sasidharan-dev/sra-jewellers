import { MapPin, ShieldCheck, Phone, Mail } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="hidden md:block bg-maroon-950 text-cream-200 text-xs">
      <div className="container-page flex items-center justify-between py-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-gold-400" />
          <span>123, Gold Street, Coimbatore, Tamil Nadu, India</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-gold-400" />
          <span>BIS Hallmarked Jewellery</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Phone size={12} className="text-gold-400" />
            +91 98765 43210
          </span>
          <span className="flex items-center gap-1.5">
            <Mail size={12} className="text-gold-400" />
            support@srajewels.com
          </span>
        </div>
      </div>
    </div>
  );
}
