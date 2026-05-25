import Exam from '../models/Exam.js';

export const seedExams = async () => {
  try {
    const count = await Exam.countDocuments();
    if (count > 0) {
      console.log(`[Database Seed] Exam data already exists (${count} exams). Skipping seed.`);
      return;
    }

    console.log('[Database Seed] Seeding Exam datasets...');
    const exams = [
      {
        name: 'National Eligibility cum Entrance Test (NEET UG 2026)',
        code: 'NEET',
        description: 'Unified entrance test for admission to undergraduate medical and dental courses in all medical colleges across India.',
        applicationFee: 1700,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // opened 5 days ago
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days remaining
        examDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        signatureColor: '#ef4444',
        cardGlowColor: 'rgba(239,68,68,0.4)'
      },
      {
        name: 'Joint Entrance Examination (JEE Main 2026)',
        code: 'JEE',
        description: 'National level engineering entrance examination for admission into NITs, IIITs, and other premier technical institutions.',
        applicationFee: 1000,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        signatureColor: '#0ea5e9',
        cardGlowColor: 'rgba(14,165,233,0.4)'
      },
      {
        name: 'UGC National Eligibility Test (UGC NET 2026)',
        code: 'UGC_NET',
        description: 'Test to determine the eligibility of Indian nationals for Assistant Professor, Junior Research Fellowship or both.',
        applicationFee: 1150,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // exactly 3 days remaining
        examDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        signatureColor: '#6366f1',
        cardGlowColor: 'rgba(99,102,241,0.4)'
      },
      {
        name: 'State Level Eligibility Test (SLET Commission)',
        code: 'SLET',
        description: 'State Level Eligibility Test conducted in Northeast states for recruitment of lecturers and assistant professors.',
        applicationFee: 1200,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        examDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        signatureColor: '#10b981',
        cardGlowColor: 'rgba(16,185,129,0.4)'
      },
      {
        name: 'SSC Combined Graduate Level (SSC CGL 2026)',
        code: 'SSC',
        description: 'Recruitment examination for Group B and Group C posts in various ministries, departments, and offices of Government of India.',
        applicationFee: 100,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        examDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        signatureColor: '#eab308',
        cardGlowColor: 'rgba(234,179,8,0.4)'
      },
      {
        name: 'Assam Public Service Commission (APSC CCE)',
        code: 'APSC',
        description: 'Civil Services Combined Competitive Examination for recruitment to Assam Civil Service, Police Service, and allied state services.',
        applicationFee: 297,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        signatureColor: '#a855f7',
        cardGlowColor: 'rgba(168,85,247,0.4)'
      }
    ];

    await Exam.insertMany(exams);
    console.log('[Database Seed] Seeding process complete. 6 examinations successfully created.');
  } catch (error) {
    console.error('[Database Seed Error] Seeding failed:', error.message);
  }
};
