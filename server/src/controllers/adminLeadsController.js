import { Lead } from '../models/Lead.js';

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    console.error('Get leads error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leads'
    });
  }
};