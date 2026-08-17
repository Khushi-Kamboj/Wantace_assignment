import { Config } from '../models/Config.js';

export const updateConfig = async (req, res) => {
  try {
    const {
      business,
      questions,
      modifiers
    } = req.body;

    // Get current configuration
    const currentConfig = await Config.findOne()
      .sort({ config_version: -1 });

    if (!currentConfig) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    // Update only the fields provided by the owner
    if (business !== undefined) {
      currentConfig.business = business;
    }

    if (questions !== undefined) {
      currentConfig.questions = questions;
    }

    if (modifiers !== undefined) {
      currentConfig.modifiers = modifiers;
    }

    // Increment configuration version
    currentConfig.config_version += 1;

    await currentConfig.save();

    return res.status(200).json({
      success: true,
      message: 'Configuration updated successfully',
      data: {
        config_version: currentConfig.config_version
      }
    });
  } catch (error) {
    console.error('Update config error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update configuration'
    });
  }
};