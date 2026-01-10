
import { CURRICULUM_DATA } from './curriculum-data';
import type { Chapter, Class, Plan, Subject } from './types';

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    priceDetails: 'per month',
    generations: 5,
    features: [
      '5 Generations per month',
      'Access to all subjects',
      'PDF Export',
      'Basic Support',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '₹449',
    priceDetails: 'per month',
    generations: 25,
    features: [
      '25 Generations per month',
      'Access to all subjects',
      'PDF Export with Answers',
      'Priority Support',
    ],
    isFeatured: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹1,299',
    priceDetails: 'per month',
    generations: 100,
    features: [
      '100 Generations per month',
      'Access to all subjects & question types',
      'Custom Branding on PDFs',
      '24/7 Priority Support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹2,499',
    priceDetails: 'per month',
    generations: Infinity,
    features: [
      'Unlimited Generations',
      'Access to all subjects & future features',
      'Custom Branding on PDFs',
      'Dedicated Account Manager',
    ],
  }
];


export const getClasses = async (): Promise<Pick<Class, 'id' | 'name'>[]> => {
  const classList = CURRICULUM_DATA.map(c => ({ id: c.id, name: c.name }));
  return classList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
};

export const getSubjects = async (classId: string): Promise<Pick<Subject, 'id' | 'name'>[]> => {
    if (!classId) return [];
    const classData = CURRICULUM_DATA.find(c => c.id === classId);
    if (!classData) return [];
    const subjectList = classData.subjects.map(s => ({ id: s.id, name: s.name }));
    return subjectList.sort((a,b) => a.name.localeCompare(b.name));
};

export const getChapters = async (classId: string, subjectId: string): Promise<Chapter[]> => {
    if (!classId || !subjectId) return [];
    const classData = CURRICULUM_DATA.find(c => c.id === classId);
    if (!classData) return [];
    const subjectData = classData.subjects.find(s => s.id === subjectId);
    if (!subjectData) return [];
    // The data is already in book sequence in the source file, so we just return it.
    // If sorting is needed, it can be done here.
    return subjectData.chapters.sort((a,b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
};

export const getClassAndSubjectDetails = async (classId: string, subjectId: string): Promise<{className: string, subjectName: string} | null> => {
    if (!classId || !subjectId) return null;
    const classData = CURRICULUM_DATA.find(c => c.id === classId);
    const subjectData = classData?.subjects.find(s => s.id === subjectId);

    if (!classData || !subjectData) {
        return null;
    }
    return {
        className: classData.name,
        subjectName: subjectData.name,
    };
}
