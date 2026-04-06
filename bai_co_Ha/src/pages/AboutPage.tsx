import { Award, Heart, Users, Utensils } from "lucide-react";
import { ImageWithFallback } from "../app/components/figma/ImageWithFallback";

export function AboutPage() {
  const values = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Quality Ingredients",
      description:
        "We source only the finest, freshest ingredients from local suppliers and farms.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Food",
      description:
        "Every dish is prepared with love and attention to detail by our dedicated team.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Focus",
      description:
        "We believe in giving back to our community and supporting local businesses.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description:
        "Our commitment to excellence has earned us numerous awards and recognition.",
    },
  ];

  const team = [
    {
      name: "Chef Michael Rodriguez",
      role: "Head Chef",
      image:
        "https://images.unsplash.com/photo-1717838207789-62684e75a770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwY2hlZiUyMGNvb2tpbmd8ZW58MXx8fHwxNzc0NzcyOTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "With over 20 years of culinary experience, Chef Michael brings creativity and expertise to every dish.",
    },
    {
      name: "Sarah Thompson",
      role: "Restaurant Manager",
      image:
        "https://images.unsplash.com/photo-1717838207789-62684e75a770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwY2hlZiUyMGNvb2tpbmd8ZW58MXx8fHwxNzc0NzcyOTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Sarah ensures every guest has an exceptional dining experience from start to finish.",
    },
    {
      name: "David Chen",
      role: "Sous Chef",
      image:
        "https://images.unsplash.com/photo-1717838207789-62684e75a770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwY2hlZiUyMGNvb2tpbmd8ZW58MXx8fHwxNzc0NzcyOTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "David's innovative approach to classic dishes has made him an invaluable member of our team.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Restora</h1>
          <p className="text-xl text-amber-100">
            Our Story, Our Passion, Our Commitment
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2010, Restora began with a simple vision: to create
                  a dining experience that celebrates fresh, locally-sourced
                  ingredients and exceptional hospitality. What started as a
                  small family-owned restaurant has grown into a beloved
                  culinary destination in the heart of New York City.
                </p>
                <p>
                  Our journey has been guided by a commitment to quality,
                  innovation, and community. We believe that great food brings
                  people together, creating memories that last a lifetime. Every
                  dish we serve tells a story, combining traditional techniques
                  with modern creativity.
                </p>
                <p>
                  Today, Restora continues to evolve while staying true to our
                  core values. We're proud to be part of the local community and
                  grateful for the loyal guests who have made us a part of their
                  lives.
                </p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758648207365-df458d3e83f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwZGluaW5nfGVufDF8fHx8MTc3NDgzNzYwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            The talented people behind your exceptional dining experience
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Awards & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
                <Award className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Best Restaurant 2025
              </h3>
              <p className="text-gray-600">New York Dining Awards</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
                <Award className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Michelin Star</h3>
              <p className="text-gray-600">Michelin Guide 2024</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
                <Award className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top 50 Restaurants</h3>
              <p className="text-gray-600">Food & Wine Magazine</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Experience the Restora Difference
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Join us for an unforgettable dining experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reservation"
              className="inline-block bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Reservation
            </a>
            <a
              href="/menu"
              className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
