import prisma from '../config/db.js';

export const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { examDate: 'asc' }
    });
    return res.json(exams);
  } catch (error) {
    console.error('[Get Exams Error]', error);
    return res.status(500).json({ message: 'Server error fetching exams' });
  }
};

export const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { id }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    return res.json(exam);
  } catch (error) {
    console.error('[Get Exam Detail Error]', error);
    return res.status(500).json({ message: 'Server error fetching exam details' });
  }
};
