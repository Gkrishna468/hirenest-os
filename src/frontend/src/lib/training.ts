export const TRAINING_RECOMMENDATIONS: Record<
  string,
  { course: string; provider: string }
> = {
  AWS: {
    course: "AWS Certified Solutions Architect – Associate",
    provider: "AWS",
  },
  React: { course: "React – The Complete Guide", provider: "Udemy" },
  TypeScript: {
    course: "TypeScript: The Complete Developer's Guide",
    provider: "Udemy",
  },
  Kubernetes: {
    course: "Kubernetes for Developers",
    provider: "Linux Foundation",
  },
  Python: { course: "Python Bootcamp – Zero to Hero", provider: "Udemy" },
  TensorFlow: {
    course: "TensorFlow Developer Certificate",
    provider: "Google",
  },
  Docker: {
    course: "Docker & Kubernetes: The Practical Guide",
    provider: "Udemy",
  },
  "Node.js": { course: "Node.js – The Complete Guide", provider: "Udemy" },
  GraphQL: {
    course: "GraphQL with React: The Complete Developers Guide",
    provider: "Udemy",
  },
  Terraform: {
    course: "Terraform Associate Certification",
    provider: "HashiCorp",
  },
  Go: { course: "Go: The Complete Developer's Guide", provider: "Udemy" },
  Golang: { course: "Go: The Complete Developer's Guide", provider: "Udemy" },
  Kafka: { course: "Apache Kafka Series", provider: "Udemy" },
  Spark: { course: "Apache Spark with Scala", provider: "Udemy" },
  "Vue.js": { course: "Vue – The Complete Guide", provider: "Udemy" },
  Angular: { course: "Angular – The Complete Guide", provider: "Udemy" },
  PostgreSQL: { course: "The Complete SQL Bootcamp", provider: "Udemy" },
  MongoDB: {
    course: "MongoDB – The Complete Developer's Guide",
    provider: "Udemy",
  },
  PyTorch: { course: "PyTorch for Deep Learning", provider: "Udemy" },
  MLOps: { course: "MLOps Specialization", provider: "Coursera" },
  Kotlin: {
    course: "Android Kotlin Development Masterclass",
    provider: "Udemy",
  },
  Swift: {
    course: "iOS & Swift – The Complete iOS App Development Bootcamp",
    provider: "Udemy",
  },
  Azure: {
    course: "AZ-900: Microsoft Azure Fundamentals",
    provider: "Microsoft",
  },
  GCP: {
    course: "Google Cloud Professional Data Engineer",
    provider: "Google",
  },
};

export function getTrainingRecommendation(
  skill: string,
): { course: string; provider: string } | null {
  return TRAINING_RECOMMENDATIONS[skill] ?? null;
}
