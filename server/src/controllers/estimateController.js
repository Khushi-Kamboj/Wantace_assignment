import { Config } from '../models/Config.js';
import { Lead } from '../models/Lead.js';
import { calculateEstimate } from '../services/calculator.js';

export const createEstimate = async (req, res) => {
  try {
    const { name, phone, email, answers } = req.body;

    // 1. Basic contact validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Answers are required'
      });
    }

    // 2. Get current active configuration
    const config = await Config.findOne()
      .sort({ config_version: -1 })
      .lean();

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Active configuration not found'
      });
    }

    // 3. Validate answers against configuration
    for (const question of config.questions) {
      if (!question.active) {
        continue;
      }

      const answer = answers[question.key];

      // Required question
      if (
        question.required &&
        (answer === undefined ||
          answer === null ||
          answer === '')
      ) {
        return res.status(400).json({
          success: false,
          message: `${question.label} is required`
        });
      }

      if (answer === undefined || answer === null || answer === '') {
        continue;
      }

      // Number validation
      if (question.type === 'number') {
        const numericAnswer = Number(answer);

        if (Number.isNaN(numericAnswer)) {
          return res.status(400).json({
            success: false,
            message: `${question.label} must be a number`
          });
        }

        if (
          question.min !== undefined &&
          numericAnswer < question.min
        ) {
          return res.status(400).json({
            success: false,
            message: `${question.label} must be at least ${question.min}`
          });
        }

        if (
          question.max !== undefined &&
          numericAnswer > question.max
        ) {
          return res.status(400).json({
            success: false,
            message: `${question.label} must be at most ${question.max}`
          });
        }
      }

      // Select validation
      if (question.type === 'select') {
        const validOption = question.options.some(
          option => option.value === String(answer)
        );

        if (!validOption) {
          return res.status(400).json({
            success: false,
            message: `Invalid option selected for ${question.label}`
          });
        }
      }
    }

    // 4. Calculate estimate on server
    const estimate = calculateEstimate(config, answers);

    // 5. Store lead
    const lead = await Lead.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      answers,
      estimate_low: estimate.estimate_low,
      estimate_high: estimate.estimate_high,
      config_version: config.config_version
    });

    // 6. Return estimate
    return res.status(201).json({
      success: true,
      data: {
        lead_id: lead._id,
        estimate_low: estimate.estimate_low,
        estimate_high: estimate.estimate_high,
        config_version: config.config_version
      }
    });
  } catch (error) {
    console.error('Create estimate error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to calculate estimate'
    });
  }
};