import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
export default class ReviewController {

    /**
     * List all reviews
     *  
     */
    static index = async (req: Request, res: Response) => {
        try {
            const reviews = await prisma.review.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json({
                success: true,
                data: reviews
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };




    /**
     * Create Review
     * 
     */
   
  static create = async (req:Request, res:Response) => {
    try {
      const { user_id, store_id, rating, comment } = req.body;

      if (!user_id || !rating) {
        return res.status(400).json({
          success: false,
          message: "User ID and rating are required"
        });
      }

      if (!store_id) {
        return res.status(400).json({
          success: false,
          message: "store_id is required"
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5"
        });
      }

      // Check user
      const user = await prisma.user.findUnique({
        where: { id: user_id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Store review check
      if (store_id) {
        const store = await prisma.store.findUnique({
          where: { id: store_id }
        });

        if (!store) {
          return res.status(404).json({
            success: false,
            message: "Store not found"
          });
        }

        const existingReview = await prisma.review.findFirst({
          where: { user_id, store_id }
        });

        if (existingReview) {
          return res.status(400).json({
            success: false,
            message: "You have already reviewed this store"
          });
        }
      }

     

      const review = await prisma.review.create({
        data: {
          user_id,
          store_id,
          rating,
          comment
        }
      });

      res.status(201).json({
        success: true,
        data: review
      });

    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };


  /**
   * Get reviews by ID
   */
// ===============================
  // Find review by ID
  // ===============================
 static find = async (req:Request, res:Response) => {
    try {
      const { id } = req.params;

      const review = await prisma.review.findUnique({
        where: { id: Number(id) }
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found"
        });
      }

      res.status(200).json({
        success: true,
        data: review
      });

    } catch (error:any) {
      res.status(500).json({
        success: false,
        
        error: error.message
      });
    }
  };




  /**
   * Update Review
   */
  static update = async (req:Request, res:Response) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5"
        });
      }

      const review = await prisma.review.findUnique({
        where: { id: Number(id) }
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found"
        });
      }

      const updatedReview = await prisma.review.update({
        where: { id: Number(id) },
        data: {
          rating: rating ?? review.rating,
          comment: comment ?? review.comment
        }
      });

      res.status(200).json({
        success: true,
        
        data: updatedReview
      });

    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };




   /**
    * Dlete Review
    * @param req 
    * @param res 
    */
  static destroy = async (req:Request, res:Response) => {
    try {
      const { id } = req.params;

      await prisma.review.delete({
        where: { id: Number(id) }
      });

      res.status(200).json({
        success: true,
        
      });

    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };




  /**
   * Get Review By Store
   * @param req 
   * @param res 
   * @returns 
   */

  static getByStore = async (req:Request, res:Response) => {
    try {
      const { store_id } = req.params;

      const store = await prisma.store.findUnique({
        where: { id: Number(store_id) }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store not found"
        });
      }

      const reviews = await prisma.review.findMany({
        where: { store_id: Number(store_id) },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: reviews
      });

    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };




/**
 * Get Review By User
 * @param req 
 * @param res 
 * @returns 
 */

  static getByUser = async (req:Request, res:Response) => {
    try {
      const { user_id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(user_id) }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const reviews = await prisma.review.findMany({
        where: { user_id: Number(user_id) },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: reviews
      });

    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };



}