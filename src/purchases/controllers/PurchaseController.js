const { Request, Response, NextFunction } = require('express')

// DAO
const { PurchaseDAO } = require('../dao')
const { APIError } = require('../../application/helpers')

/**
 * Create a Purchase
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const createPurchase = async (req, res, next) => {
    try {
        await PurchaseDAO.addPurchase(req.body, 'employee') //brute force
        res.status(200).json({ message: 'Purchase successfully added' })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

/**
 * Get all Purchases
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllPurchases = async (req, res, next) => {
    try {
        const purchases = await PurchaseDAO.findAllPurchases()
        res.status(200).json({ purchases: purchases })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

/**
 * Get a Customer's Purchases
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getPurchaseByCostumer = async (req, res, next) => {
    console.log('HERE')
    try {
        const purchases = await PurchaseDAO.findPurchasesByCostumer(
            req.params['reader_card_num']
        )
        res.status(200).json({ purchases: purchases })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseByCostumer,
}
