import Faq from "@/components/sections/Home/Faq";
import Hero from "@/components/sections/Home/Hero";

const FAQ_IDS = [
  {
    q: "What kind of tours do you offer from Marrakech?",
    a: "We offer a wide range of tours from Marrakech, including Sahara desert tours (2, 3, or 4 days to Merzouga and Zagora), day trips to Essaouira, Ouarzazate, Aït Ben Haddou, Ourika Valley, and the Atlas Mountains, as well as guided city tours of Marrakech and multi-day Morocco packages covering Fes, Chefchaouen, and Casablanca.",
  },
  {
    q: "When is the best time to visit Marrakech and Morocco?",
    a: "The best time to visit Morocco is from March to May and September to November, when temperatures are pleasant for both city sightseeing and desert excursions. Winter is ideal for exploring imperial cities, while summer is better for coastal destinations like Essaouira. We operate tours year-round with adjusted itineraries for each season.",
  },
  {
    q: "How long should I stay in Morocco to enjoy the main highlights?",
    a: "We recommend at least 5 to 7 days to enjoy Marrakech, a Sahara desert tour, and one or two day trips. For a complete Morocco experience including Fes, Chefchaouen, and the Atlantic coast, 10 to 14 days is ideal. We can customize any itinerary to fit your travel time and interests.",
  },
  {
    q: "Are your tours private or in a group?",
    a: "We offer both options. Private tours are exclusive to you and your group with a personalized itinerary, flexible schedule, and dedicated driver-guide. Group tours are more affordable and let you share the experience with other travelers. All our vehicles are modern, air-conditioned, and driven by experienced local guides.",
  },
  {
    q: "Is Morocco a safe destination for tourists?",
    a: "Yes, Morocco is one of the safest countries in North Africa and a top destination for solo travelers, families, and couples. Our tours are operated by licensed local guides and experienced drivers, using well-maintained vehicles and trusted accommodations. We provide 24/7 assistance throughout your journey for complete peace of mind.",
  },
  {
    q: "Do I need a visa to travel to Morocco?",
    a: "Travelers from the EU, UK, USA, Canada, Australia, and many other countries can enter Morocco visa-free for stays up to 90 days. Your passport must be valid for at least 6 months from your entry date. We recommend checking the latest requirements with the Moroccan consulate before booking.",
  },
  {
    q: "What is included in your Marrakech tours and packages?",
    a: "Our tours typically include private or shared transportation in air-conditioned vehicles, a professional English-speaking driver or licensed guide, accommodation in selected riads or hotels, and most meals depending on the package. Entrance fees, camel rides, and activities are clearly listed on each tour page.",
  },
  {
    q: "How can I book a tour and what payment methods do you accept?",
    a: "You can book any tour directly on our website by choosing your date, group size, and preferences. We accept major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers. A small deposit secures your booking, with the balance payable before or on the day of your tour.",
  },
];


export default function Home() {
  return (
    <>
      <Hero />
      <Faq faq={FAQ_IDS} />
    </>
  );
}
