import express, { Request, Response } from 'express'
import { Article, ArticleStore } from '../models/articles'

const store = new ArticleStore()
const index = async (_req: Request, res: Response) => {
  const articles = await store.index()
  res.json(articles)
}

const show = async (req: Request, res: Response) => {
   const article = await store.show(parseInt(req.params.id));
   res.json(article)
}

const create = async (req: Request, res: Response) => {
    try {
        const article: Article = {
            title: req.body.title,
            content: req.body.content,
        }

        const newArticle = await store.create(article)
        res.json(newArticle)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.body.id)
    res.json(deleted)
}

const articleRoutes = (app: express.Application) => {
  app.get('/article', index)
  app.get('/article/:id', show)
  app.post('/article', create)
  app.delete('/article', destroy)
}

export default articleRoutes