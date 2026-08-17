import { Config } from '../models/Config.js';

export const getPublicConfig = async (req, res) => {
  try {
    const config = await Config.findOne()
      .sort({ config_version: -1 })
      .lean();

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    const activeQuestions = config.questions
      .filter(question => question.active)
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: {
        config_version: config.config_version,
        business: config.business,
        questions: activeQuestions,
      }
    });
  } catch (error) {
    console.error('Get config error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration'
    });
  }
};