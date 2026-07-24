// Temporary mock data used to build out the UI before the backend API is wired in.
// Every page below is written against the same shape the real API (see /backend) will return,
// so swapping mock arrays for `service.list()` calls later is a drop-in change.

export const COURSES = [
  { id: 1, title: "Full Stack Web Development", category: "Web Development", duration: "16 Weeks", level: "Beginner", rating: 4.8, price: 45999, image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600" },
  { id: 2, title: "Data Science & Machine Learning", category: "Data Science", duration: "20 Weeks", level: "Intermediate", rating: 4.7, price: 52999, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600" },
  { id: 3, title: "Cloud & DevOps Engineering", category: "Cloud Computing", duration: "14 Weeks", level: "Intermediate", rating: 4.6, price: 47999, image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600" },
  { id: 4, title: "Cybersecurity Fundamentals", category: "Security", duration: "12 Weeks", level: "Beginner", rating: 4.9, price: 39999, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600" },
  { id: 5, title: "UI/UX Design Bootcamp", category: "Design", duration: "10 Weeks", level: "Beginner", rating: 4.8, price: 34999, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600" },
  { id: 6, title: "Java Backend Development", category: "Web Development", duration: "18 Weeks", level: "Advanced", rating: 4.5, price: 42999, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600" },
];

export const COURSE_CATEGORIES = ["Web Development", "Data Science", "Cloud Computing", "Security", "Design"];
export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const JOBS = [
  { id: 1, title: "Junior Frontend Developer", company: "Nimbus Softwares", location: "Kanpur, IN", type: "Full-time", postedAt: "2 days ago" },
  { id: 2, title: "Backend Engineer (Node.js)", company: "Orbit Tech", location: "Remote", type: "Full-time", postedAt: "5 days ago" },
  { id: 3, title: "Data Analyst Intern", company: "Lumen Analytics", location: "Bengaluru, IN", type: "Internship", postedAt: "1 week ago" },
  { id: 4, title: "DevOps Engineer", company: "CloudPeak Systems", location: "Hyderabad, IN", type: "Full-time", postedAt: "3 days ago" },
];

export const JOB_TYPES = ["Full-time", "Internship", "Contract", "Remote"];

export const BLOG_POSTS = [
  { id: 1, title: "5 In-Demand Tech Skills for 2026", excerpt: "A look at the skills employers are actively hiring for this year.", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600", category: "Career Advice", date: "Jul 10, 2026", author: "Team ATG" },
  { id: 2, title: "How to Build a Portfolio That Gets Interviews", excerpt: "Practical tips for showcasing projects that recruiters actually notice.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600", category: "Career Advice", date: "Jul 2, 2026", author: "Team ATG" },
  { id: 3, title: "Cloud Certifications Worth Pursuing", excerpt: "Which cloud certifications actually move the needle on your resume.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600", category: "Cloud", date: "Jun 22, 2026", author: "Team ATG" },
];

export const TESTIMONIALS = [
  { id: 1, name: "Aarav Sharma", role: "Full Stack Developer at Nimbus", quote: "The mentorship and placement support made all the difference in landing my first tech role.", rating: 5 },
  { id: 2, name: "Priya Nair", role: "Data Analyst at Lumen", quote: "Hands-on projects gave me the confidence to speak about real work in interviews.", rating: 5 },
  { id: 3, name: "Rohan Verma", role: "DevOps Engineer at CloudPeak", quote: "Structured curriculum and great instructors — I'd recommend it to anyone starting out.", rating: 4 },
];

export const SUCCESS_STORIES = [
  { id: 1, name: "Sneha Gupta", title: "From Retail to Software Engineer", summary: "Sneha transitioned careers in 6 months through our full stack program.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600" },
  { id: 2, name: "Karan Mehta", title: "Landing a Remote DevOps Role", summary: "Karan used our cloud track to move into a fully remote DevOps position.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600" },
];

export const HIRING_PARTNERS = [
  { id: 1, name: "Nimbus Softwares" }, { id: 2, name: "Orbit Tech" }, { id: 3, name: "Lumen Analytics" },
  { id: 4, name: "CloudPeak Systems" }, { id: 5, name: "Vertex Solutions" }, { id: 6, name: "Bright Path Labs" },
];

export const EVENTS = [
  { id: 1, title: "Tech Career Fair 2026", date: "Aug 15, 2026", location: "Kanpur Convention Center", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600" },
  { id: 2, title: "Free Webinar: Breaking into Cloud", date: "Aug 2, 2026", location: "Online", image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600" },
];

export const GALLERY_IMAGES = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  url: `https://images.unsplash.com/photo-${["1522071820081-009f0129c71c", "1523240795612-9a054b0db644", "1517048676732-d65bc937f952", "1524178232363-1fb2b075b655"][i % 4]}?w=500`,
}));

export const FAQS = [
  { id: 1, question: "Do I need prior experience to enroll?", answer: "No — our beginner tracks start from the fundamentals, no prior coding experience required." },
  { id: 2, question: "Is placement support guaranteed?", answer: "We provide dedicated placement assistance, resume reviews, and interview prep for every graduate, though outcomes depend on individual performance and the market." },
  { id: 3, question: "Can I pay in installments?", answer: "Yes, flexible EMI options are available for all our programs." },
  { id: 4, question: "Are classes online or in-person?", answer: "We offer both online live classes and in-person sessions at select centers." },
];
