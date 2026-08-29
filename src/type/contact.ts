export type ContactItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
  href?: string;
};

export type Reason = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type Faq = {
  question: string;
  answer: string;
};
