import { RequestHandler } from "express";

export const get404Page: RequestHandler = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Pound' });
}