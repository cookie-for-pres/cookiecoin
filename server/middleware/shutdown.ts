import Middleware from '../models/Middleware';

export default async (req: any, res: any, next: any) => {
  const shutdown = await Middleware.findOne({ name: 'shutdown' });
  
  if (shutdown.active) {
    res.status(401).json({
      message: 'shutdown protocol activated',
      success: false
    });
  } else {
    next();
  }
}