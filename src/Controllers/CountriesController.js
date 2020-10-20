const Country = require('../Models/Country');
const Keyword = require('../Models/Keyword');
const { Types } = require('mongoose');
const { findOrCreate } = require('../Helpers/Criteria');
const { readFile } = require('../Helpers/File');

module.exports = {

    /**
     * Save Countries
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {

        const reg =  JSON.parse(await readFile(__dirname + '/../Utils/data/regex.json'))
        const countries =  JSON.parse(await readFile(__dirname + '/../Utils/data/countries.json'))

        await countries.map(async item => {

            const finded = reg.find(regx => regx['ISO2'] === item.code)
            if (finded) {
                return await findOrCreate(Country, {code: item.code}, {
                    regex: finded.regex,
                    name: item.longname,
                    name_variations: {
                        ar: item.name_ar,
                        cs: item.name_cs,
                        cy: item.name_cy,
                        da: item.name_da,
                        de: item.name_de,
                        en: item.name_en,
                        es: item.name_es,
                        fr: item.name_fr,
                        he: item.name_he,
                        it: item.name_it,
                        ja: item.name_ja,
                        nl: item.name_nl,
                        pt: item.name_pt,
                        ru: item.name_ru,
                        sk: item.name_sk,
                        zn_cn: item.name_zn_cn,
                        zh_hk: item.name_zh_hk,
                    },
                    lat: item.latitude,
                    lng: item.longitude,
                    ...item,
                })
            }
        });

        res.json({message: 'ok'});
    },

    /**
     * List all countries
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async list(req, res) {
        try {

            let countries = await Country
                .find()
                .select('_id name regex code')
                .sort({ name: 1 })
                .exec();

            countries = await Promise.all(countries.map(async country => {
                const keywords = await Keyword.aggregate([
                    {
                        $match: {
                            countries: { $eq: Types.ObjectId(country._id) },
                        }
                    },
                    {
                        $group: { _id: country._id, total: { $sum: 1 } }
                    },
                    { $project: { _id: 0 } }
                ]).exec();

                const total = keywords[0] ? keywords[0].total : 0
                return {...country._doc, keywords: total}
            }))

            res.json({message: 'ok', countries})
            
        } catch (error) {
            res.status(400).json({
                message: 'FAIL TO LIST',
                error: error.message
            })
        }
    },

    /**
     * List Keywords By Country
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async keywords(req, res) {
        try {
            let { country } = req.params;
            let { page, perPage, search } = req.query;

            page = page ? Number(page) : 1;
            perPage = perPage ? Number(perPage) : 10;
            search = search ? search : '';

            country = await Country.findOne({code: country}).select('_id name regex code').orFail();
            
            const exp = new RegExp(`.*${search}.*`, 'gi');
            const keywords = await Keyword.aggregate([
                {
                    $match: {
                        countries: { $eq: Types.ObjectId(country._id) },
                        name: exp
                    }
                },
                { 
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        countries: {
                            $filter: {
                                input: "$countries",
                                as: "country",
                                cond: { $eq: ["$$country", Types.ObjectId(country._id)] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        country: { $arrayElemAt: ["$countries", 0] },
                        total: { $size: "$countries" }
                    }
                },
                {
                    $sort : { total : -1 }
                },
                { 
                    $skip: (page-1) * perPage
                },
                {
                    $limit: perPage,
                },
            ]).exec();

            return res.json({
                country,
                keywords,
            });

        } catch (e) {
            return res.status(400)   .json({
                message: 'FAIL TO LIST',
                error: e.message
            })
        }
    }
}