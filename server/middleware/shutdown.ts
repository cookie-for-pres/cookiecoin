import Middleware from '../models/Middleware';
import config from '../config/config';

export default async (req: any, res: any, next: any) => {
  const shutdown = await Middleware.findOne({ _id: config.shutdownId });

  if (shutdown.active) {
    res.status(401).json({
      message: 'shutdown protocol activated',
      success: false
    });
  } else {
    next();
  }
}