import { Router } from "express";
import { IEventRepo } from "../db/repo";

export const txRouter = (repo: IEventRepo): Router => {
  const router = Router();

  router.get("/", (req, res) => {
    try {
      const events = repo.getAllEvents(
        req.query.from?.toString(),
        req.query.to?.toString()
      );
      res.status(200).json(events);
    } catch (e: any) {
      res.status(500).json({ message: e.toString() });
    }
  });

  router.get("/tx_event", (req, res) => {
    try {
      const { chain_nonce, action_id, tx_hash } = req.body;
      const event = repo.updateEvent(action_id, chain_nonce, tx_hash);
      res.status(200).json(event);
    } catch (e: any) {
      res.status(500).json({ message: e.toString() });
    }
  });
  return router;
};
