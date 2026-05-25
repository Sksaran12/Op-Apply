import Exam from '../models/Exam.js';

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ examDate: 1 });
    return res.json(exams);
  } catch (error) {
    console.error('[Get Exams Error]', error);
    return res.status(500).json({ message: 'Server error fetching exams' });
  }
};

export const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    return res.json(exam);
  } catch (error) {
    console.error('[Get Exam Detail Error]', error);
    return res.status(500).json({ message: 'Server error fetching exam details' });
  }
};
