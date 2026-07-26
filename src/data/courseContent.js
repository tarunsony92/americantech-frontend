// src/data/courseContent.js
//
// Static "known course" content used ONLY as a fallback when the backend
// record itself doesn't supply tools / curriculum / capstoneProjects /
// eligibility / careerRoles for that course.
//
// How it works:
//   1. getCourseContentKey(course.title) looks at the course title and
//      decides which bucket below it belongs to.
//   2. CourseDetails.jsx then does:
//        course.tools?.length ? course.tools : (matched?.tools || DEFAULT_TOOLS)
//      i.e. backend data always wins, then the matched static content for
//      THIS course, then the generic defaults as the last resort.
//
// Add a new course? Just add a new key below + a matching rule in
// getCourseContentKey().

export const COURSE_CONTENT = {
  // ---------------------------------------------------------------------
  // 1) Cyber Security & Ethical Hacking
  // ---------------------------------------------------------------------
  CYBER_ETHICAL_HACKING: {
    tools: ["Nmap", "Kali Linux", "Metasploit", "Nikto", "Nessus", "Wireshark", "Burp Suite", "Hashcat"],

    curriculum: [
      { title: "Module 1: Foundations of Cyber Defense & Ethical Practices", desc: "Core principles of cyber defense and the ethical framework behind responsible hacking." },
      { title: "Module 2: Network Architecture & Security Essentials", desc: "How networks are built, and the fundamentals of securing them." },
      { title: "Module 3: Linux & Security Operations Environment", desc: "Get comfortable operating in Linux-based security tooling environments." },
      { title: "Module 4: Cyber Reconnaissance & Intelligence Gathering", desc: "Techniques for gathering information on targets, legally and ethically." },
      { title: "Module 5: Threat & Vulnerability Assessment", desc: "Identify, classify, and prioritize vulnerabilities in systems." },
      { title: "Module 6: Exploitation & Post-Exploitation Techniques", desc: "Understand how exploits work and what happens after initial access." },
      { title: "Module 7: Secure Web Application Analysis", desc: "Find and analyze security flaws in web applications." },
      { title: "Module 8: Wireless & Mobile Network Security", desc: "Securing Wi-Fi and mobile network infrastructure." },
      { title: "Module 9: Penetration Testing Methodologies", desc: "Structured, industry-standard approaches to pen testing." },
      { title: "Module 10: Advanced Cyber Threats & Defense Strategies", desc: "Modern attack patterns and how defenders respond to them." },
      { title: "Module 11: Security Operations & Incident Response", desc: "Running a SOC and responding to live incidents." },
      { title: "Module 12: Governance, Risk, Compliance & Cyber Law", desc: "The legal, regulatory, and governance side of cybersecurity." },
    ],

    capstoneProjects: [
      { tag: "Network security", title: "Network intrusion detection", desc: "Build an ML-powered IDS that classifies malicious traffic patterns and generates real-time alerts from network logs.", stack: ["Python", "Scapy", "Scikit-learn", "Wireshark"], color: "from-blue-500 to-cyan-500" },
      { tag: "Cryptography", title: "Password vault & encryption", desc: "Design a secure password manager using AES-256 encryption and PBKDF2 key derivation to protect user credentials locally.", stack: ["Python", "PyCryptodome", "SQLite"], color: "from-amber-500 to-orange-500" },
      { tag: "Threat intel", title: "Malware analysis sandbox", desc: "Create an automated sandbox to execute and analyze suspicious binaries, extract IOCs, and generate behavioral threat reports.", stack: ["Python", "YARA", "Cuckoo", "Docker"], color: "from-indigo-500 to-blue-500" },
      { tag: "Social engineering", title: "Phishing detection model", desc: "Train a classifier to detect phishing URLs and email content using NLP features and domain reputation scoring.", stack: ["Python", "NLTK", "XGBoost", "VirusTotal API"], color: "from-violet-500 to-fuchsia-500" },
      { tag: "SIEM & monitoring", title: "Security event dashboard", desc: "Build a SIEM-lite dashboard ingesting syslog data to visualise anomalies, alert thresholds, and incident timelines in real time.", stack: ["ELK Stack", "Kibana", "Python", "Logstash"], color: "from-emerald-500 to-teal-500" },
      { tag: "Pen testing", title: "Web app vulnerability scanner", desc: "Develop an automated scanner to discover OWASP Top 10 vulnerabilities including SQLi, XSS, and CSRF in test web targets.", stack: ["Python", "Burp Suite", "Selenium", "OWASP ZAP"], color: "from-rose-500 to-pink-500" },
      { tag: "Data protection", title: "Cloud misconfiguration auditor", desc: "Scan AWS and GCP environments for exposed buckets, overprivileged IAM roles, and insecure security group configurations.", stack: ["Python", "Boto3", "Prowler", "Terraform"], color: "from-red-500 to-orange-500" },
      { tag: "Digital forensics", title: "Incident response toolkit", desc: "Build a forensic triage tool that captures volatile memory, parses system artefacts, and produces a structured incident timeline.", stack: ["Python", "Volatility", "Autopsy", "Pandas"], color: "from-cyan-500 to-sky-500" },
    ],

    eligibility: [
      "Individuals already working in IT, software development, network administration, or related fields who want to specialize in cybersecurity.",
      "IT professionals who want to upgrade their careers. Graduates with at least 50% marks in the graduation final result.",
      "Individuals with a simple background and at least 60% marks in higher secondary education.",
      "Individuals who want to get ample career options and earn competitive salaries.",
      "Those who want to learn network security and digital security techniques.",
    ],

    careerRoles: [
      "Ethical Hacker", "Cyber Security Analyst", "Penetration Tester", "SOC Analyst",
      "Security Engineer", "Incident Responder", "Malware Analyst", "Vulnerability Assessor",
    ],
  },

  // ---------------------------------------------------------------------
  // 2) Cyber Security & Artificial Intelligence
  // ---------------------------------------------------------------------
  CYBER_AI: {
    tools: ["Nmap", "Kali Linux", "Metasploit", "Nikto", "Nessus", "Wireshark", "Burp Suite", "Hashcat"],

    curriculum: [
      { title: "Module 1: AI-Powered Cyber Security Foundations", desc: "Introduction to Cyber Security, AI in Modern Security Operations, Intelligent Threat Landscape, AI-based Risk Assessment, Security Frameworks & Governance." },
      { title: "Module 2: AI-Driven Network & System Security", desc: "Using AI models to harden and monitor network and system-level security." },
      { title: "Module 3: AI-Powered Ethical Hacking & Penetration Testing", desc: "Applying AI-assisted techniques to ethical hacking and pen testing workflows." },
      { title: "Module 4: Python, Machine Learning & Security Automation", desc: "Automate security tasks and build ML pipelines with Python." },
      { title: "Module 5: AI-Based SOC Operations & SIEM", desc: "Running a modern SOC augmented with AI-driven SIEM tooling." },
      { title: "Module 6: AI Security Automation & SOAR", desc: "Orchestrating automated security response with SOAR platforms." },
      { title: "Module 7: Artificial Intelligence for Threat Detection", desc: "Using AI models to detect emerging and known threats faster." },
      { title: "Module 8: Generative AI Security & Defense", desc: "Security implications and defensive use-cases of generative AI." },
      { title: "Module 9: AI-Based Malware Analysis & Threat Hunting", desc: "Applying AI to accelerate malware analysis and proactive threat hunting." },
    ],

    // Same capstone lineup as shown in the course material
    capstoneProjects: [
      { tag: "Network security", title: "Network intrusion detection", desc: "Build an ML-powered IDS that classifies malicious traffic patterns and generates real-time alerts from network logs.", stack: ["Python", "Scapy", "Scikit-learn", "Wireshark"], color: "from-blue-500 to-cyan-500" },
      { tag: "Cryptography", title: "Password vault & encryption", desc: "Design a secure password manager using AES-256 encryption and PBKDF2 key derivation to protect user credentials locally.", stack: ["Python", "PyCryptodome", "SQLite"], color: "from-amber-500 to-orange-500" },
      { tag: "Threat intel", title: "Malware analysis sandbox", desc: "Create an automated sandbox to execute and analyze suspicious binaries, extract IOCs, and generate behavioral threat reports.", stack: ["Python", "YARA", "Cuckoo", "Docker"], color: "from-indigo-500 to-blue-500" },
      { tag: "Social engineering", title: "Phishing detection model", desc: "Train a classifier to detect phishing URLs and email content using NLP features and domain reputation scoring.", stack: ["Python", "NLTK", "XGBoost", "VirusTotal API"], color: "from-violet-500 to-fuchsia-500" },
      { tag: "SIEM & monitoring", title: "Security event dashboard", desc: "Build a SIEM-lite dashboard ingesting syslog data to visualise anomalies, alert thresholds, and incident timelines in real time.", stack: ["ELK Stack", "Kibana", "Python", "Logstash"], color: "from-emerald-500 to-teal-500" },
      { tag: "Pen testing", title: "Web app vulnerability scanner", desc: "Develop an automated scanner to discover OWASP Top 10 vulnerabilities including SQLi, XSS, and CSRF in test web targets.", stack: ["Python", "Burp Suite", "Selenium", "OWASP ZAP"], color: "from-rose-500 to-pink-500" },
      { tag: "Data protection", title: "Cloud misconfiguration auditor", desc: "Scan AWS and GCP environments for exposed buckets, overprivileged IAM roles, and insecure security group configurations.", stack: ["Python", "Boto3", "Prowler", "Terraform"], color: "from-red-500 to-orange-500" },
      { tag: "Digital forensics", title: "Incident response toolkit", desc: "Build a forensic triage tool that captures volatile memory, parses system artefacts, and produces a structured incident timeline.", stack: ["Python", "Volatility", "Autopsy", "Pandas"], color: "from-cyan-500 to-sky-500" },
    ],

    eligibility: [
      "Individuals already working in IT, software development, network administration, or related fields who want to specialize in cybersecurity.",
      "IT professionals who want to upgrade their careers. Graduates with at least 50% marks in the graduation final result.",
      "Individuals with a simple background and at least 60% marks in higher secondary education.",
      "Individuals who want to get ample career options and earn competitive salaries.",
      "Those who want to learn network security and digital security techniques.",
    ],

    careerRoles: [
      "Ethical Hacker", "Cyber Security Analyst", "Penetration Tester", "SOC Analyst",
      "Security Engineer", "Incident Responder", "Malware Analyst", "Vulnerability Assessor",
    ],
  },

  // ---------------------------------------------------------------------
  // 3) Data Science And AI Program
  // ---------------------------------------------------------------------
  DATA_SCIENCE_AI: {
    tools: ["Python", "Numpy", "Pandas", "LLM", "ML", "Power BI", "Jupyter", "Tableau"],

    curriculum: [
      { title: "Module 1: Python Programming for Data Science", desc: "Core Python skills applied specifically to data science workflows." },
      { title: "Module 2: Statistics for Data Science", desc: "The statistical foundations behind every data science technique." },
      { title: "Module 3: Python Libraries & Exploratory Data Analysis", desc: "Hands-on EDA using the core Python data science stack." },
      { title: "Module 4: Chatbots & Conversational AI", desc: "Building conversational AI systems and chatbots." },
      { title: "Module 5: Machine Learning (Supervised & Unsupervised Learning)", desc: "Core ML algorithms across both supervised and unsupervised approaches." },
      { title: "Module 6: Deep Learning and AI Fundamentals", desc: "Neural networks and the fundamentals underpinning modern AI." },
      { title: "Module 7: Adaptive AI & Generative AI (GenAI)", desc: "Prompt engineering, text/image generation, and the role of diffusion models and transformers." },
      { title: "Module 8: Large Language Models (LLMs)", desc: "Understanding and working with LLMs in real projects." },
      { title: "Module 9: Power BI & Google Data Studio", desc: "Building dashboards and reports with leading BI tools." },
      { title: "Module 10: Data Engineering & Big Data Tools", desc: "Pipelines and infrastructure for large-scale data processing." },
      { title: "Module 11: Natural Language Processing (NLP) & MLOps", desc: "NLP techniques plus deploying and operating ML models in production." },
      { title: "Module 12: Capstone Project", desc: "Bring everything together in a portfolio-ready capstone build." },
    ],

    capstoneProjects: [
      { tag: "Machine Learning", title: "US Health Care Analysis", desc: "Analyze real-world U.S. healthcare data to uncover insights on costs, performance, and regional trends.", stack: ["Python", "Excel", "Pandas", "Seaborn"], color: "from-blue-500 to-cyan-500" },
      { tag: "Computer Vision", title: "Emotion Recognition", desc: "Build a deep learning model that classifies human emotions from facial expressions for smarter customer engagement.", stack: ["TensorFlow", "OpenCV", "Keras"], color: "from-violet-500 to-fuchsia-500" },
      { tag: "Computer Vision", title: "Distracted Driver Recognition", desc: "Detect driver distractions in real-time using AI-powered computer vision to improve road and passenger safety.", stack: ["PyTorch", "CNN", "OpenCV"], color: "from-rose-500 to-pink-500" },
      { tag: "NLP", title: "Customer Sentiment Analysis", desc: "Mine product reviews and social media posts to classify sentiment and surface actionable business insights.", stack: ["NLTK", "BERT", "Sklearn", "Tableau"], color: "from-emerald-500 to-teal-500" },
      { tag: "Data Viz", title: "Sales Forecasting Dashboard", desc: "Build an interactive BI dashboard that forecasts quarterly sales using time-series models and visual storytelling.", stack: ["Power BI", "ARIMA", "SQL", "Excel"], color: "from-amber-500 to-orange-500" },
      { tag: "Time Series", title: "Stock Price Prediction", desc: "Apply LSTM neural networks and feature engineering to predict stock closing prices from historical market data.", stack: ["Python", "LSTM", "yfinance", "Matplotlib"], color: "from-indigo-500 to-blue-500" },
      { tag: "Machine Learning", title: "Churn Prediction Model", desc: "Predict customer churn for a telecom dataset using classification models and interpret results with SHAP values.", stack: ["XGBoost", "SHAP", "Sklearn", "Pandas"], color: "from-cyan-500 to-sky-500" },
      { tag: "Business Intel", title: "E-commerce Recommendation Engine", desc: "Design a collaborative filtering system that personalises product recommendations and improves conversion rates.", stack: ["Python", "Surprise", "Cosine Sim", "Flask"], color: "from-red-500 to-orange-500" },
    ],

    eligibility: [
      "Individuals already working in IT, software development, network administration, or related fields who want to specialize in Data Science.",
      "IT professionals who want to upgrade their careers. Graduates with at least 50% marks in the graduation final result.",
      "Individuals with a simple background and at least 60% marks in higher secondary education.",
      "Individuals who want to get ample career options and earn competitive salaries.",
      "Those who want to learn Data Science, Machine Learning, Deep Learning and Generative AI Technologies.",
    ],

    careerRoles: [
      "ML Engineer", "Data Scientist", "AI Research Scientist", "NLP Engineer",
      "Computer Vision Engineer", "Data Engineer", "Business Analyst (AI)",
      "MLOps Engineer", "AI Product Manager", "AI Entrepreneur",
    ],
  },
};

/**
 * Decide which static content bucket a course belongs to, purely by its title.
 * Order matters: check the more specific "cyber + AI" rule before the plain
 * "cyber" rule, otherwise "Cyber Security And Artificial Intelligence" would
 * incorrectly match the Ethical Hacking bucket.
 */
export function getCourseContentKey(title = "") {
  const t = title.toLowerCase();

  if (t.includes("data science")) return "DATA_SCIENCE_AI";

  if (t.includes("cyber") && (t.includes("artificial intelligence") || t.includes(" ai") || t.endsWith(" ai"))) {
    return "CYBER_AI";
  }

  if (t.includes("cyber") || t.includes("ethical hacking")) {
    return "CYBER_ETHICAL_HACKING";
  }

  return null; // unknown course -> caller should fall back to generic DEFAULT_*
}
