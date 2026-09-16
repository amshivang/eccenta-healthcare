"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Star, Clock, Users, MapPin, Video, 
  Share2, Heart, GraduationCap, Award, Stethoscope, MessageCircle 
} from "lucide-react";
import BookingModal from "../components/BookingModal";
import DoctorMapView from "../components/DoctorMapView";

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    let ignore = false;
    const id = params?.id;
    if (!id) return;

    fetch(`/api/doctors/${id}`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Doctor not found");
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        let servicesList: string[] = [];
        if (Array.isArray(data.services)) {
          servicesList = data.services;
        } else if (typeof data.services === "string") {
          try {
            servicesList = JSON.parse(data.services);
          } catch {
            servicesList = data.services.split(",").map((s: string) => s.trim());
          }
        }
        if (!servicesList || servicesList.length === 0) {
          servicesList = [`${data.specialization} Consultation`, "General Diagnosis", "Follow-up Care"];
        }

        let educationList = data.education;
        if (!Array.isArray(educationList) || educationList.length === 0) {
          const qual = data.qualification || "MBBS";
          educationList = [
            { degree: qual, institute: data.hospitalName || data.clinicAddress || "Medical Institute", year: `${new Date().getFullYear() - (data.experience || 10)}` }
          ];
        }

        let reviewsList = (data.reviews || []).map((r: any) => ({
          id: r.id,
          user: r.reviewerName || "Patient",
          rating: Number(r.rating) || 5,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent",
          comment: r.reviewText || "Great consultation.",
        }));
        if (reviewsList.length === 0) {
          reviewsList = [
            { id: 1, user: "Verified Patient", rating: 5, date: "Recently", comment: "Very thorough consultation and helpful advice." }
          ];
        }

        setDoctor({
          ...data,
          services: servicesList,
          education: educationList,
          reviews: reviewsList,
        });
        setIsFavorited(Boolean(data.isFavorited));
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        console.error(err);
        setDoctor(null);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4 md:p-6">
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Doctor not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-cyan-600 font-medium">Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-6 animate-fade-in relative">
      
      {/* Header / Top Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6 relative">
        <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-700 w-full relative">
          <button onClick={() => router.back()} className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsFavorited(!isFavorited)} 
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 mb-4">
            {doctor.profileImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={doctor.profileImage} alt={doctor.name} loading="lazy" className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-white" />
            ) : (
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                {doctor.name.split(" ").slice(-1)[0]?.[0] || "D"}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{doctor.name}</h1>
                  <p className="text-lg text-cyan-600 font-medium mt-1">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500">{doctor.qualification}</p>
                </div>
                
                <div className="hidden md:block">
                  <button onClick={() => setIsBookingOpen(true)} className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500"><Star className="w-5 h-5 fill-amber-400" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Rating</p>
                <p className="font-bold text-gray-900">{doctor.rating} <span className="text-xs font-normal text-gray-500">({doctor.totalReviews})</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500"><Clock className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Experience</p>
                <p className="font-bold text-gray-900">{doctor.experience} Yrs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500"><Stethoscope className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Consultation</p>
                <p className="font-bold text-gray-900">₹{doctor.consultationFee}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Patients</p>
                <p className="font-bold text-gray-900">1K+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-600" /> About Doctor
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {doctor.bio}
            </p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-600" /> Services Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.services.map((service: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-100">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-600" /> Education & Training
            </h3>
            <div className="space-y-4">
              {doctor.education.map((edu: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institute}</p>
                    <p className="text-xs text-gray-400 mt-1">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reviews */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-600" /> Patient Reviews
            </h3>
            <div className="space-y-4">
              {doctor.reviews.map((review: any) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-cyan-600 font-semibold border border-cyan-100 rounded-xl hover:bg-cyan-50 transition-colors">
              View All Reviews
            </button>
          </div>

        </div>

        {/* Right Column / Sidebar */}
        <div className="space-y-6">
          
          {/* Availability Details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
             <div className="space-y-3">
               <div className={`p-4 rounded-xl border ${doctor.offlineAvailable ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                 <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                   <MapPin className={`w-4 h-4 ${doctor.offlineAvailable ? 'text-purple-600' : 'text-gray-400'}`} /> In-Clinic Visit
                 </div>
                 <p className="text-xs text-gray-600 ml-6">Available Today • Next slot at 4:30 PM</p>
               </div>
               <div className={`p-4 rounded-xl border ${doctor.onlineAvailable ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                 <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                   <Video className={`w-4 h-4 ${doctor.onlineAvailable ? 'text-blue-600' : 'text-gray-400'}`} /> Video Consult
                 </div>
                 <p className="text-xs text-gray-600 ml-6">Available in 15 mins</p>
               </div>
             </div>
          </div>

          {/* Clinic Location */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
             <h3 className="text-lg font-bold text-gray-900 mb-2">{doctor.hospitalName || "Clinic Location"}</h3>
             <p className="text-sm text-gray-500 mb-4 flex items-start gap-1">
               <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {doctor.clinicAddress || "Clinic Address"}
             </p>
             {doctor.latitude && doctor.longitude && !isNaN(parseFloat(doctor.latitude)) && (
               <div className="rounded-2xl overflow-hidden mb-4">
                  <DoctorMapView doctors={[doctor]} center={{lat: parseFloat(doctor.latitude), lng: parseFloat(doctor.longitude)}} />
               </div>
             )}
             <button 
               onClick={() => {
                 const dest = (doctor.clinicAddress || doctor.hospitalName)
                   ? `${doctor.name}, ${doctor.clinicAddress || doctor.hospitalName}${doctor.city ? `, ${doctor.city}` : ''}`
                   : `${doctor.latitude},${doctor.longitude}`;
                 window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, '_blank');
               }}
               className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
             >
               <MapPin className="w-5 h-5 text-gray-500" />
               Open in Google Maps
             </button>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Consultation Fee</p>
            <p className="text-lg font-bold text-gray-900">₹{doctor.consultationFee}</p>
          </div>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="flex-[2] py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} doctor={doctor} />
    </div>
  );
}
